using Microsoft.EntityFrameworkCore;
using TheBookApp.Db.Models;

namespace TheBookApp.Db
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options)
            : base(options) { }

        public DbSet<Book> Books { get; set; }
    }
}
