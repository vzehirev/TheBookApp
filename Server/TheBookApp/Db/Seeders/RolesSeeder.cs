using Microsoft.AspNetCore.Identity;
using System;

namespace TheBookApp.Db.Seeders
{
    public class RolesSeeder
    {
        private readonly RoleManager<IdentityRole> roleManager;

        public RolesSeeder(RoleManager<IdentityRole> roleManager)
        {
            this.roleManager = roleManager;
        }

        public void Seed()
        {
            foreach (var role in Enum.GetValues(typeof(Roles)))
            {
                roleManager.CreateAsync(new IdentityRole(role.ToString())).GetAwaiter().GetResult();
            }
        }
    }
}
