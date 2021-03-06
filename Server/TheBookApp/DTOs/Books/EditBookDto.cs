﻿using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace TheBookApp.DTOs.Books
{
    public class EditBookDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required, MinLength(10), MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        public int Year { get; set; }

        public IFormFile NewCover { get; set; }
    }
}
