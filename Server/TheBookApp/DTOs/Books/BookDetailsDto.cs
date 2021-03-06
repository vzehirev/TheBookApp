﻿using System;
using System.Collections.Generic;

namespace TheBookApp.DTOs.Books
{
    public class BookDetailsDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string CoverUrl { get; set; }

        public int Upvotes { get; set; }

        public int Downvotes { get; set; }

        public int Year { get; set; }

        public IEnumerable<ReviewDto> Reviews { get; set; }
    }
}
