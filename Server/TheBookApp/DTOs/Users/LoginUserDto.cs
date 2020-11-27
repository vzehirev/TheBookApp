using System.ComponentModel.DataAnnotations;

namespace TheBookApp.DTOs.Users
{
    public class LoginUserDto
    {
        [Required, MinLength(4), MaxLength(20)]
        public string Username { get; set; }

        [Required, MinLength(6), MaxLength(20)]
        public string Password { get; set; }
    }
}
