import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [detectionType, setDetectionType] = useState('all');  // or your detection type options
  const [confidence, setConfidence] = useState('0.25'); // default confidence as string
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('yolo11x.pt'); // default model

  // COCO dataset class names
  const cocoClasses = [
    'airplane', 'apple', 'backpack', 'banana', 'baseball hat', 'baseball glove', 'bear', 'bed', 'bench',
    'bicycle', 'bird', 'boat', 'book', 'bottle', 'bowl', 'broccoli', 'bus', 'cake', 'car', 'carrot', 'cat',
    'cell phone', 'chair', 'clock', 'couch', 'cow', 'cup', 'dining table', 'dog', 'donut', 'elephant',
    'fire hydrant', 'fork', 'frisbee', 'giraffe', 'hair drier', 'handbag', 'horse', 'hot dog', 'keyboard',
    'kite', 'knife', 'laptop', 'microwave', 'motorcycle', 'mouse', 'orange', 'oven', 'parking meter',
    'person', 'pizza', 'potted plant', 'refrigerator', 'remote', 'sandwich', 'scissors', 'sheep', 'sink',
    'skateboard', 'skis', 'snowboard', 'spoon', 'sports ball', 'stop sign', 'suitcase', 'surfboard',
    'teddy bear', 'tennis racket', 'tie', 'toaster', 'toilet', 'toothbrush', 'traffic light', 'train',
    'truck', 'tv', 'umbrella', 'vase', 'wine glass', 'zebra'
  ];


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('detectionType', detectionType);
    formData.append('minConfidence', confidence);  // send confidence
    formData.append('model',model)
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5157/api/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      console.error('Detection failed:', err);
      setResult({ error: 'Detection failed. See console.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Smart Camera Object Detection</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required />
        <br /><br />
        <label>
          Detection Type:
          <select value={detectionType} onChange={e => setDetectionType(e.target.value)}>
            <option value="all">All</option>
            {cocoClasses.map((className, index) => (
              <option key={index} value={className}>{className}</option>
            ))}
          </select>
        </label>

        <br /><br />
      
        <label>
        Model:
          <select value={model} onChange={e => setModel(e.target.value)}>
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
            
          </select>
        </label>
      
      <br/><br/>
      
        <label>
          Min Confidence (0 to 1):
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={confidence}
            onChange={e => setConfidence(e.target.value)}
            required
          />
        </label>
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Detecting...' : 'Submit'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Results:</h3>
          {result.annotated_image_url && (
            <img src={result.annotated_image_url} alt="Annotated" style={{ maxWidth: '100%' }} />
          )}
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;