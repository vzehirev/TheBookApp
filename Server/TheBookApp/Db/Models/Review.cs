using System;
using System.ComponentModel.DataAnnotations;

namespace TheBookApp.Db.Models
{
    public class Review
    {
        [Required, Key]
        public int Id { get; set; }

        [Required, MinLength(5), MaxLength(1000)]
        public string Text { get; set; }

        [Required]
        public string UserId { get; set; }
        public User User { get; set; }

        [Required]
        public int BookId { get; set; }
        public Book Book { get; set; }

        [Required]
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
    }
}
