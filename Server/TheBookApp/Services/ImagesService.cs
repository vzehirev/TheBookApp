using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace TheBookApp.Services
{
    public class ImagesService
    {
        private const int maxImageWidth = 1100;
        private const int maxImageHeight = 1100;
        private readonly IConfiguration configuration;
        private readonly Account cloudinaryAccount;
        private readonly Cloudinary cloudinary;

        public ImagesService(IConfiguration configuration)
        {
            this.configuration = configuration;

            cloudinaryAccount = new Account(
                this.configuration["Cloudinary:Name"],
                this.configuration["Cloudinary:Key"],
                this.configuration["Cloudinary:Secret"]);

            cloudinary = new Cloudinary(cloudinaryAccount);
        }

        public async Task<string> UploadImageAsync(Stream imageFileStream)
        {
            ImageUploadParams imageUploadParams = new ImageUploadParams()
            {
                File = new FileDescription(Guid.NewGuid().ToString(), imageFileStream),
                Folder = configuration["Cloudinary:Folder"],
                Transformation = new Transformation()
                .Width(maxImageWidth)
                .Height(maxImageHeight)
                .Crop(configuration["Cloudinary:Crop"]),
            };

            ImageUploadResult imageUploadResult = await cloudinary.UploadAsync(imageUploadParams);

            return imageUploadResult.SecureUrl.OriginalString;
        }
    }
}
