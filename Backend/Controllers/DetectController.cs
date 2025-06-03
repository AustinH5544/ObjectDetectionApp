using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DetectController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<DetectController> _logger;

        public DetectController(IHttpClientFactory httpClientFactory, ILogger<DetectController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Detect(
            [FromForm] IFormFile file,
            [FromForm] string detectionType,
            [FromForm] float minConfidence = 0.25f,
            [FromForm] string model = "yolo11x.pt")
        {
            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("Detect request received with no file.");
                return BadRequest("No file uploaded.");
            }

            _logger.LogInformation("Received file: {FileName} for detection: {Type} with minConfidence: {Confidence}",
                file.FileName, detectionType, minConfidence);

            var httpClient = _httpClientFactory.CreateClient();

            using var content = new MultipartFormDataContent();

            var streamContent = new StreamContent(file.OpenReadStream());
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);

            content.Add(streamContent, "file", file.FileName);
            content.Add(new StringContent(detectionType), "detectionType");
            content.Add(new StringContent(minConfidence.ToString(System.Globalization.CultureInfo.InvariantCulture)), "minConfidence");
            content.Add(new StringContent(model), "model");

            _logger.LogInformation("Forwarding image to Python service...");

            try
            {
                // Adjust URL and port if your Python backend runs elsewhere
                var response = await httpClient.PostAsync("http://localhost:5000/detect", content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Python service returned error: {StatusCode}", response.StatusCode);
                    return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
                }

                var resultJson = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("Python service returned: {Result}", resultJson);

                return Content(resultJson, "application/json");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while calling the Python ML service.");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}