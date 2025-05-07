import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [detectionType, setDetectionType] = useState('object_type_detection');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDetectionTypeChange = (e) => {
    setDetectionType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('detectionType', detectionType);

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (err) {
      console.error('Detection failed', err);
      setResult({ error: 'Detection failed. See console.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Smart Camera Object Detection</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <br /><br />
        <label>
          Detection Type:
          <select value={detectionType} onChange={handleDetectionTypeChange}>
            <option value="object_type_detection">Person / Car / Animal</option>
          </select>
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
