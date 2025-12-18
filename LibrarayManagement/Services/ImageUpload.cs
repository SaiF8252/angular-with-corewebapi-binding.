namespace LibrarayManagement.Services
{
    public class ImageUpload(IWebHostEnvironment host) : IImageUpload
    {
        public async Task<string?> UploadFile(IFormFile file, CancellationToken C)
        {
            if (file == null) return null;
            string fileName = $@"\images\{file.FileName}";
            string uploadpath = $"{host.WebRootPath}\\{fileName}";
            using var stream = File.Create(uploadpath);
            await file.CopyToAsync(stream, C);
            return fileName;
        }
    }
}
