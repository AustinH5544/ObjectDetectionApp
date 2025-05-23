from ultralytics import YOLO
from PIL import Image

model = YOLO("yolov8n.pt")  # use 'yolov8m.pt' if you want more accuracy

# Custom label mapping for this use case
CATEGORY_MAP = {
    'person': 'person',
    'car': 'car',
    'truck': 'car',
    'bus': 'car',
    'motorcycle': 'car',
    'dog': 'animal',
    'cat': 'animal',
    'horse': 'animal',
    'sheep': 'animal',
    'cow': 'animal'
}

def run_detection(image_path, detection_type):
    results = model(image_path)[0]
    found = set()
    raw_detections = []

    for box in results.boxes:
        class_id = int(box.cls[0])
        label = results.names[class_id]

        mapped = CATEGORY_MAP.get(label)
        if mapped:
            found.add(mapped)
            raw_detections.append({
                "original_label": label,
                "mapped_label": mapped,
                "confidence": float(box.conf[0])
            })

    return {
        "detected": list(found),
        "details": raw_detections
    }
