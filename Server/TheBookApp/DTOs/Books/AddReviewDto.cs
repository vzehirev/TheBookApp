using System.ComponentModel.DataAnnotations;

namespace TheBookApp.DTOs.Books
{
    public class AddReviewDto
    {
        [Required]
        public int BookId { get; set; }

        [Required, MinLength(5), MaxLength(1000)]
        public string Review { get; set; }
    }
}
