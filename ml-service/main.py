from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from detection import run_detection
import shutil
import uuid
import os

app = FastAPI()

# Allow cross-origin requests (like different port for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files from the outputs directory (for annotated images and videos)
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

@app.post("/detect")
async def detect_object(
    file: UploadFile,
    detectionType: str = Form(...),
    minConfidence: float = Form(0.25),
    model: str = Form("yolo11x.pt")
):
    # Get file extension
    file_extension = os.path.splitext(file.filename)[-1].lower()
    temp_filename = f"temp_{uuid.uuid4()}{file_extension}"

    # Save uploaded file temporarily
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Run detection (returns result dict)
    result = run_detection(temp_filename, detectionType, minConfidence, model)

    # Remove temp file
    os.remove(temp_filename)

    # Return appropriate URL based on file type
    if "annotated_image_url" in result:
        result["annotated_image_url"] = f"http://localhost:5000/outputs/{os.path.basename(result['annotated_image_url'])}"
    elif "annotated_video_url" in result:
        result["annotated_video_url"] = f"http://localhost:5000/outputs/{os.path.basename(result['annotated_video_url'])}"

    return result
