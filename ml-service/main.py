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

# Serve static files from the outputs directory (for annotated images)
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

@app.post("/detect")
async def detect_object(
    file: UploadFile,
    detectionType: str = Form(...),
    minConfidence: float = Form(0.25),
    model: str = Form("yolo11x.pt")
):
    temp_filename = f"temp_{uuid.uuid4()}.jpg"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Pass minConfidence to your detection function
    result = run_detection(temp_filename, detectionType, minConfidence,model)

    os.remove(temp_filename)

    if "annotated_image" in result:
        annotated_filename = os.path.basename(result["annotated_image"])
        result["annotated_image_url"] = f"http://localhost:5000/outputs/{annotated_filename}"

    return result
