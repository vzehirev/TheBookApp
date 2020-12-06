using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using TheBookApp.Db.Models;

namespace TheBookApp.Db.Seeders
{
    public class AdminSeeder
    {
        private readonly IConfiguration configuration;
        private readonly UserManager<User> userManager;

        public AdminSeeder(IConfiguration configuration, UserManager<User> userManager)
        {
            this.configuration = configuration;
            this.userManager = userManager;
        }

        public void AddAdmin()
        {
            var adminUser = userManager.FindByNameAsync(configuration["Admin:Username"]).GetAwaiter().GetResult();

            if (adminUser == null)
            {
                adminUser = new User
                {
                    UserName = configuration["Admin:Username"],
                    Email = configuration["Admin:Email"]
                };

                userManager.CreateAsync(adminUser, configuration["Admin:Password"]).GetAwaiter().GetResult();
                userManager.AddToRoleAsync(adminUser, Roles.Admin.ToString()).GetAwaiter().GetResult();
            }
        }
    }
}
