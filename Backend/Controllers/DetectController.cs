using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace backend.Controllers
{
    [ApiController]
    // Sets the base route to "api/detect"
    [Route("api/[controller]")]
    public class DetectController : ControllerBase
    {
        // Used to create instances of HttpClient
        private readonly IHttpClientFactory _httpClientFactory;

        private readonly ILogger<DetectController> _logger;

        public DetectController(IHttpClientFactory httpClientFactory, ILogger<DetectController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        // POST endpoint to receive image and detection type
        [HttpPost]
        public async Task<IActionResult> Detect([FromForm] IFormFile file, [FromForm] string detectionType)
        {
            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("Detect request received with no file.");
                return BadRequest("No file uploaded.");
            }

            // Log the received file and detection type
            _logger.LogInformation("Received file: {FileName} for detection: {Type}", file.FileName, detectionType);

            // Create a new HttpClient for calling the Python ML service
            var httpClient = _httpClientFactory.CreateClient();

            // Create a multipart form data content to send the file and detection type
            using var content = new MultipartFormDataContent();
            // Wrap the uploaded file stream in an HTTP-compatible content object
            var streamContent = new StreamContent(file.OpenReadStream());
            streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
            // Add the file content to the form under the field name "file"
            content.Add(streamContent, "file", file.FileName);
            // Add the detection type to the form
            content.Add(new StringContent(detectionType), "detectionType");

            _logger.LogInformation("Forwarding image to Python service...");

            try
            {
                // Send the request to the FastAPI Python backend at /detect
                var response = await httpClient.PostAsync("http://localhost:5000/detect", content);

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Python service returned error: {StatusCode}", response.StatusCode);
                    return StatusCode((int)response.StatusCode, await response.Content.ReadAsStringAsync());
                }

                // Read the JSON result returned from the Python ML service
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