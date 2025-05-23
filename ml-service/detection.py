from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont
import os
import uuid

model = YOLO("yolov8n.pt")

# Mapping of detected classes to custom categories (like car/animal/persom)
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

    # Open the image for drawing
    image = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(image)

    # Load a font
    try:
        font = ImageFont.truetype("arial.ttf", 16)
    except:
        font = ImageFont.load_default()  # fallback so it *always* works

    # Draw bounding boxes and labels
    for box in results.boxes:
        class_id = int(box.cls[0])
        label = results.names[class_id]
        confidence = float(box.conf[0])
        mapped = CATEGORY_MAP.get(label)

        if mapped:
            found.add(mapped)
            raw_detections.append({
                "original_label": label,
                "mapped_label": mapped,
                "confidence": confidence
            })

            xy = box.xyxy[0].tolist()
            draw.rectangle(xy, outline="red", width=2)

            # Ensure labels are visible
            text = f"{label} {confidence:.2f}"
            text_position = (xy[0], max(0, xy[1] - 20))  # prevent text from going off top
            draw.text(text_position, text, fill="yellow", font=font)

    # Save the annotated image
    os.makedirs("outputs", exist_ok=True)
    output_filename = f"outputs/annotated_{uuid.uuid4().hex}.jpg"
    image.save(output_filename)

    return {
        "detected": list(found),
        "details": raw_detections,
        "annotated_image": output_filename
    }