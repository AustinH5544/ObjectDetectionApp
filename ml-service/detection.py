from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont
import cv2
import os
import uuid
from collections import defaultdict

def run_detection(file_path, detection_type="all", min_confidence=0.25, model_name="yolo11x.pt"):
    model = YOLO(model_name)
    print(f"Min Confidence = {min_confidence}")
    ext = os.path.splitext(file_path)[1].lower()

    found_counts = defaultdict(int)
    raw_detections = []

    os.makedirs("outputs", exist_ok=True)

    if ext in ['.mp4', '.avi', '.mov']:
        # --- Video Handling ---
        cap = cv2.VideoCapture(file_path)
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out_path = f"outputs/annotated_{uuid.uuid4().hex}.mp4"
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        out = cv2.VideoWriter(out_path, fourcc, fps, (width, height))

        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                break

            results = model(frame)[0]
            for box in results.boxes:
                class_id = int(box.cls[0])
                label = model.names[class_id]
                confidence = float(box.conf[0])

                if confidence < min_confidence:
                    continue
                if detection_type != "all" and detection_type != label:
                    continue

                found_counts[label] += 1
                raw_detections.append({
                    "label": label,
                    "confidence": confidence
                })

                xy = box.xyxy[0].tolist()
                cv2.rectangle(frame, (int(xy[0]), int(xy[1])), (int(xy[2]), int(xy[3])), (0, 0, 255), 2)
                cv2.putText(frame, f"{label} {confidence:.2f}", (int(xy[0]), int(xy[1]) - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 2)

            out.write(frame)

        cap.release()
        out.release()

        found_list = [{"label": label, "count": count} for label, count in found_counts.items()]
        return {
            "detected": found_list,
            "details": raw_detections,
            "annotated_video_url": out_path
        }

    else:
        # --- Image Handling ---
        results = model(file_path)[0]
        image = Image.open(file_path).convert("RGB")
        draw = ImageDraw.Draw(image)

        try:
            font = ImageFont.truetype("arial.ttf", 16)
        except:
            font = ImageFont.load_default()

        for box in results.boxes:
            class_id = int(box.cls[0])
            label = model.names[class_id]
            confidence = float(box.conf[0])

            if confidence < min_confidence:
                continue
            if detection_type != "all" and detection_type != label:
                continue

            found_counts[label] += 1
            raw_detections.append({
                "label": label,
                "confidence": confidence
            })

            xy = box.xyxy[0].tolist()
            draw.rectangle(xy, outline="red", width=2)
            text = f"{label} {confidence:.2f}"
            draw.text((xy[0], max(0, xy[1] - 20)), text, fill="yellow", font=font)

        output_filename = f"outputs/annotated_{uuid.uuid4().hex}.jpg"
        image.save(output_filename)

        found_list = [{"label": label, "count": count} for label, count in found_counts.items()]
        return {
            "detected": found_list,
            "details": raw_detections,
            "annotated_image_url": output_filename
        }
