using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TheBookApp.Db.Models;
using TheBookApp.DTOs.Users;
using TheBookApp.Services;

namespace TheBookApp.Controllers
{
    [ApiController, Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly UserManager<User> userManager;
        private readonly EmailsService emailsService;

        public AuthController(IConfiguration configuration, UserManager<User> userManager, EmailsService emailsService)
        {
            this.configuration = configuration;
            this.userManager = userManager;
            this.emailsService = emailsService;
        }

        [HttpPost, Route("register")]
        public async Task<IActionResult> RegisterAsync(RegisterUserDto inputModel)
        {
            if (!ModelState.IsValid || inputModel.Password != inputModel.ConfirmPassword)
            {
                return StatusCode(StatusCodes.Status406NotAcceptable);
            }

            var userWithSameUsername = await userManager.FindByNameAsync(inputModel.Username);
            var userWithSameEmail = await userManager.FindByEmailAsync(inputModel.Email);

            if (userWithSameUsername != null || userWithSameEmail != null)
            {
                return StatusCode(StatusCodes.Status409Conflict);
            }

            var user = new User
            {
                UserName = inputModel.Username,
                Email = inputModel.Email
            };

            var result = await userManager.CreateAsync(user, inputModel.Password);

            if (!result.Succeeded)
            {
                return StatusCode(StatusCodes.Status400BadRequest);
            }

            return StatusCode(StatusCodes.Status201Created);
        }

        [HttpPost, Route("login")]
        public async Task<IActionResult> LoginAsync(LoginUserDto inputModel)
        {
            if (!ModelState.IsValid)
            {
                return StatusCode(StatusCodes.Status406NotAcceptable);
            }

            var user = await userManager.FindByNameAsync(inputModel.Username);

            if (user == null || !await userManager.CheckPasswordAsync(user, inputModel.Password))
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            var jwt = GenerateJwt(user.Id, user.UserName);

            return Ok(new { jwt });
        }

        [HttpPost, Route("reset-password/{email}")]
        public async Task<IActionResult> ResetPassAsync(string email)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return NotFound();
            }

            var newPass = Guid.NewGuid().ToString();

            await userManager.RemovePasswordAsync(user);
            await userManager.AddPasswordAsync(user, newPass);

            await emailsService.SendAsync(user.Email, "TheBookApp password reset", $"Your new password is: {newPass}");

            return Ok();
        }

        [Authorize, HttpGet, Route("user-details")]
        public async Task<IActionResult> GetUserDetailsAsync()
        {
            var user = await userManager.GetUserAsync(User);

            if (user == null)
            {
                return NotFound();
            }

            var res = new UserDetailsDto();
            res.Username = user.UserName;
            res.Email = user.Email;

            return Ok(res);
        }

        [Authorize, HttpPost, Route("update-user")]
        public async Task<IActionResult> UpdateUserAsync(UpdateUserDto inputModel)
        {
            var user = await userManager.GetUserAsync(User);

            if (!ModelState.IsValid
                || !await userManager.CheckPasswordAsync(user, inputModel.CurrentPassword)
                || inputModel.Password != inputModel.ConfirmPassword)
            {
                return StatusCode(StatusCodes.Status406NotAcceptable);
            }

            var userWithSameUsername = await userManager.FindByNameAsync(inputModel.Username);
            var userWithSameEmail = await userManager.FindByEmailAsync(inputModel.Email);

            if ((userWithSameUsername != null && userWithSameUsername.Id != user.Id)
                || (userWithSameEmail != null && userWithSameEmail.Id != user.Id))
            {
                return StatusCode(StatusCodes.Status409Conflict);
            }

            await userManager.SetUserNameAsync(user, inputModel.Username);

            user.Email = inputModel.Email;
            await userManager.UpdateAsync(user);

            if (inputModel.Password.Length >= 6)
            {
                await userManager.RemovePasswordAsync(user);
                await userManager.AddPasswordAsync(user, inputModel.Password);
            }

            return StatusCode(StatusCodes.Status201Created);
        }

        private string GenerateJwt(string userId, string username)
        {
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Key"]));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);
            var jwtToken = new JwtSecurityToken(
                issuer: configuration["JWT:Issuer"],
                audience: configuration["JWT:Audience"],
                signingCredentials: signingCredentials,
                expires: DateTime.UtcNow.AddDays(double.Parse(configuration["JWT:DurationInDays"])),
                claims: new Claim[]
                {
                    new Claim("id", userId),
                    new Claim("username", username)
                });

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }
    }
}
