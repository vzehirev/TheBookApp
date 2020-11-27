﻿using System.ComponentModel.DataAnnotations;

namespace TheBookApp.DTOs.Books
{
    public class AddBookDto
    {
        [Required]
        public string Title { get; set; }

        [Required, MinLength(10), MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        public string CoverUrl { get; set; }
    }
}
