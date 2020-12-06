using System.ComponentModel.DataAnnotations;

namespace TheBookApp.DTOs.Users
{
    public class UpdateUserDto
    {
        [Required, MinLength(6), MaxLength(50)]
        public string CurrentPassword { get; set; }

        [Required, MinLength(4), MaxLength(20)]
        public string Username { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }
    }
}
