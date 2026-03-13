## Project Overview

A three-tier full-stack object detection web app using YOLO models. Users upload images or videos, and the system returns annotated media with bounding boxes and detection metadata.

## Architecture

```
Frontend (React, port 3000)
    ↓ POST /api/detect (multipart form)
Backend (ASP.NET Core, port 5157)
    ↓ Proxies to Python service
ML Service (FastAPI, port 5000)
    → Runs YOLO inference
    → Saves annotated output to ml-service/outputs/
    → Returns JSON + output URL
```

**Flow:** Frontend → Backend (C# proxy/gateway) → ML Service (Python YOLO inference) → outputs served from `http://localhost:5000/outputs/`

Key files:
- `frontend/src/App.js` — main React UI with model/class/confidence controls
- `Backend/Controllers/DetectController.cs` — single `POST /api/detect` endpoint, proxies to Python
- `ml-service/main.py` — FastAPI app, CORS, static file serving
- `ml-service/detection.py` — YOLO inference, image/video processing, bounding box drawing

## Running the Services

All three services must run simultaneously. Start ML service first.

**ML Service (Python, port 5000):**
```bash
cd ml-service
pip install fastapi uvicorn ultralytics opencv-python pillow
python main.py
```

**Backend (C# ASP.NET Core, port 5157):**
```bash
cd Backend
dotnet restore
dotnet run
```

**Frontend (React, port 3000):**
```bash
cd frontend
npm install
npm start
```

## Tech Stack

- **Frontend:** React (Create React App), Axios
- **Backend:** ASP.NET Core 8.0 (.NET 8), C#
- **ML Service:** Python, FastAPI, Ultralytics YOLO (v8/v11), OpenCV, Pillow

## Supported Models

YOLOv11 and YOLOv8 variants (nano/small/medium/large/xlarge), plus an Object365 model. The frontend dropdown maps model names to YOLO weight files loaded in `detection.py`.

## Detection Parameters

- `detectionType`: specific COCO/Object365 class name, or `"all"`
- `minConfidence`: float 0–1 (default 0.25)
- `model`: model name string

## CORS Configuration

- Backend allows `http://localhost:3000`
- ML Service allows all origins

## Output Files

Annotated results are saved to `ml-service/outputs/` as `.jpg` (images) or `.mp4` (videos) and served as static files by FastAPI.
