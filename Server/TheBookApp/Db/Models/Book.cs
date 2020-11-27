using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TheBookApp.Db.Models
{
    public class Book
    {
        [Required, Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }
        public User User { get; set; }

        [Required]
        public string Title { get; set; }

        [Required, MinLength(10), MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        public string CoverUrl { get; set; }

        public IEnumerable<Rating> Ratings { get; set; }
    }
}
