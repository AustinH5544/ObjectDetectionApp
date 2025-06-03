"use client"

import { useState } from "react"
import axios from "axios"
import "./App.css"

function App() {
  const [file, setFile] = useState(null)
  const [detectionType, setDetectionType] = useState("all")
  const [confidence, setConfidence] = useState("0.25")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState("yolo11x.pt")

  // COCO dataset class names
  const cocoClasses = [
    "airplane",
    "apple",
    "backpack",
    "banana",
    "baseball hat",
    "baseball glove",
    "bear",
    "bed",
    "bench",
    "bicycle",
    "bird",
    "boat",
    "book",
    "bottle",
    "bowl",
    "broccoli",
    "bus",
    "cake",
    "car",
    "carrot",
    "cat",
    "cell phone",
    "chair",
    "clock",
    "couch",
    "cow",
    "cup",
    "dining table",
    "dog",
    "donut",
    "elephant",
    "fire hydrant",
    "fork",
    "frisbee",
    "giraffe",
    "hair drier",
    "handbag",
    "horse",
    "hot dog",
    "keyboard",
    "kite",
    "knife",
    "laptop",
    "microwave",
    "motorcycle",
    "mouse",
    "orange",
    "oven",
    "parking meter",
    "person",
    "pizza",
    "potted plant",
    "refrigerator",
    "remote",
    "sandwich",
    "scissors",
    "sheep",
    "sink",
    "skateboard",
    "skis",
    "snowboard",
    "spoon",
    "sports ball",
    "stop sign",
    "suitcase",
    "surfboard",
    "teddy bear",
    "tennis racket",
    "tie",
    "toaster",
    "toilet",
    "toothbrush",
    "traffic light",
    "train",
    "truck",
    "tv",
    "umbrella",
    "vase",
    "wine glass",
    "zebra",
  ]

  const object365Classes = [
    "person",
    "bicycle",
    "car",
    "motorcycle",
    "airplane",
    "bus",
    "train",
    "truck",
    "boat",
    "traffic light",
    "fire hydrant",
    "stop sign",
    "parking meter",
    "bench",
    "bird",
    "cat",
    "dog",
    "horse",
    "sheep",
    "cow",
    "elephant",
    "bear",
    "zebra",
    "giraffe",
    "backpack",
    "umbrella",
    "handbag",
    "tie",
    "suitcase",
    "frisbee",
    "skis",
    "snowboard",
    "sports ball",
    "kite",
    "baseball bat",
    "baseball glove",
    "skateboard",
    "surfboard",
    "tennis racket",
    "bottle",
    "wine glass",
    "cup",
    "fork",
    "knife",
    "spoon",
    "bowl",
    "banana",
    "apple",
    "sandwich",
    "orange",
    "broccoli",
    "carrot",
    "hot dog",
    "pizza",
    "donut",
    "cake",
    "chair",
    "couch",
    "potted plant",
    "bed",
    "dining table",
    "toilet",
    "tv",
    "laptop",
    "mouse",
    "remote",
    "keyboard",
    "cell phone",
    "microwave",
    "oven",
    "toaster",
    "sink",
    "refrigerator",
    "book",
    "clock",
    "vase",
    "scissors",
    "teddy bear",
    "hair drier",
    "toothbrush",
    "banner",
    "balloon",
    "baseball",
    "bench",
    "birthday cake",
    "board",
    "bookcase",
    "bottle opener",
    "bow tie",
    "bracelet",
    "bucket",
    "building",
    "bus stop",
    "cabinet",
    "calculator",
    "candle",
    "carpet",
    "cart",
    "cell phone charger",
    "cereal box",
    "chair mat",
    "clothes",
    "clutch",
    "coffee maker",
    "comb",
    "computer monitor",
    "couch cushion",
    "credit card",
    "crown",
    "cucumber",
    "cupboard",
    "curtain",
    "desk lamp",
    "desktop computer",
    "diaper",
    "dishwasher",
    "dish towel",
    "door",
    "door handle",
    "earphones",
    "egg",
    "egg carton",
    "face mask",
    "faucet",
    "file cabinet",
    "fire extinguisher",
    "flag",
    "flower pot",
    "food processor",
    "forklift",
    "frame",
    "freezer",
    "frying pan",
    "game console",
    "garbage bin",
    "gas stove",
    "glasses",
    "glue",
    "guitar",
    "hair brush",
    "hair clip",
    "hand sanitizer",
    "headphones",
    "heater",
    "helmet",
    "hole puncher",
    "hot tub",
    "ice cream",
    "ice tray",
    "inhaler",
    "iron",
    "jar",
    "jeans",
    "key",
    "keyboard",
    "knife block",
    "ladder",
    "lamp",
    "laptop stand",
    "laundry basket",
    "leaf blower",
    "lighter",
    "magnet",
    "mailbox",
    "makeup brush",
    "mango",
    "microphone",
    "microwave oven",
    "milk",
    "minivan",
    "mirror",
    "mouse pad",
    "mug",
    "nail polish",
    "necklace",
    "notebook",
    "oven mitt",
    "package",
    "paintbrush",
    "paper towel",
    "parking meter",
    "pen",
    "pencil",
    "pepper",
    "piano",
    "picture frame",
    "pillow",
    "pizza cutter",
    "plate",
    "playing card",
    "plunger",
    "post-it note",
    "printer",
    "projector",
    "radio",
    "recycling bin",
    "remote control",
    "ring",
    "rubber band",
    "rug",
    "salt shaker",
    "sandal",
    "scarf",
    "screwdriver",
    "shampoo",
    "sharpener",
    "shaving cream",
    "shoe",
    "shovel",
    "sink faucet",
    "skate",
    "sled",
    "smoke detector",
    "soap",
    "socks",
    "spatula",
    "speaker",
    "spoon rest",
    "spray bottle",
    "squeegee",
    "stapler",
    "steering wheel",
    "stool",
    "stove",
    "suitcase handle",
    "sunglasses",
    "surfboard leash",
    "swimming pool",
    "syringe",
    "table lamp",
    "table tennis racket",
    "tape dispenser",
    "teddy bear toy",
    "television remote",
    "tent",
    "thermometer",
    "toaster oven",
    "toilet paper",
    "toothpaste",
    "towel",
    "toy car",
    "toy robot",
    "traffic cone",
    "train track",
    "trash can",
    "treadmill",
    "umbrella stand",
    "vacuum cleaner",
    "vase flower",
    "video game controller",
    "washing machine",
    "watch",
    "water bottle",
    "watermelon",
    "wheelchair",
    "window",
    "wine bottle",
    "wrench",
    "yoga mat",
  ]

  const isVideo = file && file.type.startsWith("video")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("detectionType", detectionType)
    formData.append("minConfidence", confidence)
    formData.append("model", model)

    setLoading(true)
    try {
      const response = await axios.post("http://localhost:5157/api/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setResult(response.data)
    } catch (err) {
      console.error("Detection failed:", err)
      setResult({ error: "Detection failed. See console." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>Smart Camera Object Detection</h1>
        <p>Upload an image or video to detect objects using YOLO models</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="detection-form">
          <div className="form-group">
            <label className="form-label">📁 Choose File</label>
            <input
              type="file"
              accept="image/*,video/mp4"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="file-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">🤖 Model</label>
              <select value={model} onChange={(e) => setModel(e.target.value)} className="form-select">
                <option value="yolo11s.pt">YOLOv11s</option>
                <option value="yolo11n.pt">YOLOv11n</option>
                <option value="yolo11m.pt">YOLOv11m</option>
                <option value="yolo11l.pt">YOLOv11L</option>
                <option value="yolo11x.pt">YOLOv11x</option>
                <option value="yolov8s.pt">YOLOv8s</option>
                <option value="yolov8n.pt">YOLOv8n</option>
                <option value="yolov8m.pt">YOLOv8m</option>
                <option value="yolov8l.pt">YOLOv8L</option>
                <option value="yolov8x.pt">YOLOv8x</option>
                <option value="yolo11n_object365.pt">Object365</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">🎯 Detection Type</label>
              <select value={detectionType} onChange={(e) => setDetectionType(e.target.value)} className="form-select">
                <option value="all">All Objects</option>
                {(model === "yolo11n_object365.pt" ? object365Classes : cocoClasses).map((className, index) => (
                  <option key={index} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">⚡ Min Confidence (0 to 1)</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className={`submit-btn ${loading ? "loading" : ""}`}>
            {loading ? "Detecting..." : "Detect Objects"}
          </button>
        </form>
      </div>

      {file && isVideo && (
        <div className="preview-section">
          <h3>👀 Video Preview</h3>
          <video controls className="media-preview">
            <source src={URL.createObjectURL(file)} type="video/mp4" />
          </video>
        </div>
      )}

      {result && (
        <div className="results-section">
          <h3>🎉 Detection Results</h3>

          {result.annotated_image_url && (
            <div className="result-media">
              <img src={result.annotated_image_url || "/placeholder.svg"} alt="Annotated" className="media-preview" />
            </div>
          )}

          {result.annotated_video_url && (
            <div className="result-media">
              <video controls className="media-preview">
                <source src={result.annotated_video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="json-output">
            <h4>📊 Raw Output</h4>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
