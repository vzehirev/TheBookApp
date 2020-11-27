using System.ComponentModel.DataAnnotations;

namespace TheBookApp.Db.Models
{
    public class Rating
    {
        [Required, Key]
        public int Id { get; set; }

        [Required]
        public int BookId { get; set; }
        public Book Book { get; set; }

        [Required]
        public string UserId { get; set; }
        public User User { get; set; }

        [Required]
        public bool IsUp { get; set; }
    }
}
