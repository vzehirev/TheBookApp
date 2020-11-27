using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TheBookApp.Db.Models;

namespace TheBookApp.Db
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions options)
            : base(options) { }

        public DbSet<Book> Books { get; set; }

        public DbSet<Rating> Ratings { get; set; }
    }
}
