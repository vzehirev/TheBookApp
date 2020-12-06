using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace TheBookApp.Services
{
    public class EmailsService
    {
        private readonly IConfiguration configuration;

        public EmailsService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public async Task SendAsync(string to, string subject, string body)
        {
            var client = new SmtpClient(configuration["Email:Server"], int.Parse(configuration["Email:Port"]))
            {
                Credentials = new NetworkCredential(configuration["Email:Username"], configuration["Email:Password"]),
                EnableSsl = true
            };
            await client.SendMailAsync(configuration["Email:From"], to, subject, body);
        }
    }
}
