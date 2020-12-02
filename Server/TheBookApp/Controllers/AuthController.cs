using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TheBookApp.Db.Models;
using TheBookApp.DTOs.Users;

namespace TheBookApp.Controllers
{
    [ApiController, Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly UserManager<User> userManager;

        public AuthController(IConfiguration configuration, UserManager<User> userManager)
        {
            this.configuration = configuration;
            this.userManager = userManager;
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
            var user = await userManager.FindByNameAsync(inputModel.Username);

            if (user == null || !await userManager.CheckPasswordAsync(user, inputModel.Password))
            {
                return StatusCode(StatusCodes.Status403Forbidden);
            }

            var jwt = GenerateJwt(user.Id, user.UserName);

            return Ok(new { jwt });
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
