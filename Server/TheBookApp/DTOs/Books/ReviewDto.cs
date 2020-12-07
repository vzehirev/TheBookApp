using System;

namespace TheBookApp.DTOs.Books
{
    public class ReviewDto
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public string Author { get; set; }

        public DateTime DateTime { get; set; }
    }
}
