from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont
import os
import uuid


def run_detection(image_path, detection_type="all", min_confidence=0.25, model_name="yolo11x.pt"):
    model = YOLO(model_name)
    print("Min Confidence = "+str(min_confidence))
    results = model(image_path)[0]
    found = set()
    raw_detections = []

    image = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(image)

    try:
        font = ImageFont.truetype("arial.ttf", 16)
    except:
        font = ImageFont.load_default()

    for box in results.boxes:
        class_id = int(box.cls[0])
        label = model.names[class_id]
        confidence = float(box.conf[0])

        # Filter by confidence threshold
        if confidence < min_confidence:
            continue

        # If filtering by label
        if detection_type != "all" and detection_type != label:
            continue

        found.add(label)
        raw_detections.append({
            "label": label,
            "confidence": confidence
        })

        xy = box.xyxy[0].tolist()
        draw.rectangle(xy, outline="red", width=2)
        text = f"{label} {confidence:.2f}"
        text_position = (xy[0], max(0, xy[1] - 20))
        draw.text(text_position, text, fill="yellow", font=font)

    os.makedirs("outputs", exist_ok=True)
    output_filename = f"outputs/annotated_{uuid.uuid4().hex}.jpg"
    image.save(output_filename)

    return {
        "detected": list(found),
        "details": raw_detections,
        "annotated_image": output_filename
    }
