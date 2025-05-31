import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [detectionType, setDetectionType] = useState('all');  // or your detection type options
  const [confidence, setConfidence] = useState('0.25'); // default confidence as string
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('detectionType', detectionType);
    formData.append('minConfidence', confidence);  // send confidence

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
            <option value="person">Person</option>
            <option value="car">Car</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <br /><br />
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