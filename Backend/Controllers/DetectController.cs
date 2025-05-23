using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DetectController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public DetectController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost]
        public async Task<IActionResult> Detect([FromForm] IFormFile file, [FromForm] string detectionType)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var httpClient = _httpClientFactory.CreateClient();

            using var content = new MultipartFormDataContent();
            var streamContent = new StreamContent(file.OpenReadStream());
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
            content.Add(streamContent, "file", file.FileName);
            content.Add(new StringContent(detectionType), "detectionType");

            // 🔁 Adjust this if you're not running FastAPI locally
            var response = await httpClient.PostAsync("http://localhost:5000/detect", content);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());

            var resultJson = await response.Content.ReadAsStringAsync();
            return Content(resultJson, "application/json");
        }
    }
}