﻿using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TheBookApp.Db;
using TheBookApp.Db.Models;
using TheBookApp.DTOs.Books;
using TheBookApp.DTOs.Ratings;
using TheBookApp.Services;

namespace TheBookApp.Controllers
{
    [ApiController, Route("[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly UserManager<User> userManager;
        private readonly ImagesService imagesService;

        public BooksController(AppDbContext dbContext, UserManager<User> userManager, ImagesService imagesService)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
            this.imagesService = imagesService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> GetAllBooks()
        {
            return await dbContext.Books
                .Select(b => new BookDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Description = b.Description,
                    CoverUrl = b.CoverUrl,
                    Year = b.Year,
                    Upvotes = b.Ratings.Count(r => r.IsUp),
                    Downvotes = b.Ratings.Count(r => !r.IsUp)
                })
                .ToArrayAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BookDetailsDto>> GetBook(int id)
        {
            var book = await dbContext.Books
                .Where(b => b.Id == id)
                .Select(b => new BookDetailsDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Description = b.Description,
                    CoverUrl = b.CoverUrl,
                    Year = b.Year,
                    Upvotes = b.Ratings.Count(r => r.IsUp),
                    Downvotes = b.Ratings.Count(r => !r.IsUp),
                    Reviews = b.Reviews.Select(r => new ReviewDto
                    {
                        Id = r.Id,
                        Text = r.Text,
                        Author = r.User.UserName,
                        DateTime = r.DateTime
                    })
                })
                .SingleOrDefaultAsync();

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        [Authorize, HttpGet, Route("my-books")]
        public async Task<ActionResult<BookDto[]>> MyBooks()
        {
            var user = await userManager.GetUserAsync(User);

            if (await userManager.IsInRoleAsync(user, Roles.Admin.ToString()))
            {
                return await dbContext.Books
                    .Select(b => new BookDto
                    {
                        Id = b.Id,
                        Title = b.Title,
                        Description = b.Description,
                        CoverUrl = b.CoverUrl,
                        Year = b.Year
                    })
                    .ToArrayAsync();
            }

            return await dbContext.Books
                .Where(b => b.UserId == user.Id)
                .Select(b => new BookDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Description = b.Description,
                    CoverUrl = b.CoverUrl,
                    Year = b.Year
                })
                .ToArrayAsync();
        }

        [Authorize, HttpPost, Route("add")]
        public async Task<IActionResult> AddBook([FromForm] AddBookDto inputModel)
        {
            var bookAlreadyExisting = await dbContext.Books.Where(b => b.Title == inputModel.Title).SingleOrDefaultAsync();

            if (!ModelState.IsValid || bookAlreadyExisting != null)
            {
                return StatusCode(StatusCodes.Status406NotAcceptable);
            }

            var user = await userManager.GetUserAsync(User);

            var book = new Book
            {
                UserId = user.Id,
                Title = inputModel.Title,
                Description = inputModel.Description,
                Year = inputModel.Year
            };

            using (Stream imageFileStream = inputModel.Cover.OpenReadStream())
            {
                book.CoverUrl = await imagesService.UploadImageAsync(imageFileStream);
            }

            dbContext.Books.Add(book);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created);
        }

        [Authorize, HttpDelete("{id}")]
        public async Task<ActionResult<BookDto[]>> DeleteBook(int id)
        {
            var book = await dbContext.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            var user = await userManager.GetUserAsync(User);

            if (book.UserId != user.Id && !await userManager.IsInRoleAsync(user, Roles.Admin.ToString()))
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            dbContext.Books.Remove(book);
            await dbContext.SaveChangesAsync();

            return await MyBooks();
        }

        [Authorize, HttpPut, Route("edit")]
        public async Task<IActionResult> EditBook([FromForm] EditBookDto inputModel)
        {
            if (!ModelState.IsValid)
            {
                return StatusCode(StatusCodes.Status406NotAcceptable);
            }

            var book = await dbContext.Books.FindAsync(inputModel.Id);

            if (book == null)
            {
                return NotFound();
            }

            var user = await userManager.GetUserAsync(User);

            if (book.UserId != user.Id && !await userManager.IsInRoleAsync(user, Roles.Admin.ToString()))
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            book.Title = inputModel.Title;
            book.Description = inputModel.Description;
            book.Year = inputModel.Year;

            if (inputModel.NewCover != null)
            {
                using (Stream imageFileStream = inputModel.NewCover.OpenReadStream())
                {
                    book.CoverUrl = await imagesService.UploadImageAsync(imageFileStream);
                }
            }

            dbContext.Books.Update(book);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize, HttpPost, Route("review")]
        public async Task<ActionResult<ReviewDto>> ReviewAsync(AddReviewDto inputModel)
        {
            var user = await userManager.GetUserAsync(User);

            var review = new Review
            {
                UserId = user.Id,
                BookId = inputModel.BookId,
                Text = inputModel.Review
            };

            dbContext.Reviews.Add(review);
            await dbContext.SaveChangesAsync();

            return new ReviewDto
            {
                Id = review.Id,
                Text = review.Text,
                Author = user.UserName,
                DateTime = review.DateTime
            };
        }

        [Authorize, HttpPost, Route("vote/{id}/{isUp}")]
        public async Task<IActionResult> Vote(int id, bool isUp)
        {
            var book = await dbContext.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            var user = await userManager.GetUserAsync(User);

            var rating = dbContext.Ratings.SingleOrDefault(r => r.BookId == book.Id && r.UserId == user.Id);

            if (rating != null && rating.IsUp == isUp)
            {
                dbContext.Ratings.Remove(rating);
            }
            else if (rating != null)
            {
                rating.IsUp = isUp;

                dbContext.Ratings.Update(rating);
            }
            else
            {
                rating = new Rating
                {
                    BookId = book.Id,
                    UserId = user.Id,
                    IsUp = isUp,
                };

                dbContext.Ratings.Add(rating);
            }

            await dbContext.SaveChangesAsync();

            var res = await dbContext.Books
                .Where(b => b.Id == book.Id)
                .Select(b => new VotesResponseDto
                {
                    Upvotes = b.Ratings.Where(r => r.IsUp).Count(),
                    Downvotes = b.Ratings.Where(r => !r.IsUp).Count()
                })
                .FirstOrDefaultAsync();

            return Ok(res);
        }

        [Authorize(Roles = "Admin"), HttpDelete, Route("delete-review/{id}")]
        public async Task<IActionResult> DeleteReviewAsync(int id)
        {
            var review = await dbContext.Reviews.FindAsync(id);

            if (review == null)
            {
                return NotFound();
            }

            dbContext.Reviews.Remove(review);
            await dbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
