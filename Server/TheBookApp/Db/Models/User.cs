using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace TheBookApp.Db.Models
{
    public class User : IdentityUser
    {
        public IEnumerable<Book> Books { get; set; }

        public IEnumerable<Rating> Ratings { get; set; }
    }
}
