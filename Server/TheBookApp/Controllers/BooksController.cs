using System.Collections.Generic;
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

namespace TheBookApp.Controllers
{
    [ApiController, Route("[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly UserManager<User> userManager;

        public BooksController(AppDbContext dbContext, UserManager<User> userManager)
        {
            this.dbContext = dbContext;
            this.userManager = userManager;
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
                    Upvotes = b.Ratings.Count(r => r.IsUp),
                    Downvotes = b.Ratings.Count(r => !r.IsUp),
                })
                .SingleOrDefaultAsync();

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        [Authorize, HttpPost, Route("add")]
        public async Task<IActionResult> AddBook(AddBookDto inputModel)
        {
            if (!ModelState.IsValid)
            {
                return StatusCode(StatusCodes.Status406NotAcceptable);
            }

            var user = await userManager.GetUserAsync(User);

            var book = new Book
            {
                UserId = user.Id,
                Title = inputModel.Title,
                Description = inputModel.Description,
                CoverUrl = inputModel.CoverUrl,
            };

            dbContext.Books.Add(book);
            await dbContext.SaveChangesAsync();

            return StatusCode(StatusCodes.Status201Created);
        }

        [Authorize, HttpPut, Route("edit")]
        public async Task<IActionResult> EditBook(EditBookDto inputModel)
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

            book.Title = inputModel.Title;
            book.Description = inputModel.Description;
            book.CoverUrl = inputModel.CoverUrl;

            dbContext.Books.Update(book);
            await dbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await dbContext.Books.FindAsync(id);

            if (book == null)
            {
                return NotFound();
            }

            dbContext.Books.Remove(book);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [Authorize, HttpPost("{id}"), Route("vote")]
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

            return Ok();
        }
    }
}
