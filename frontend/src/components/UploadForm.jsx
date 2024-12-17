
import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState(0); // State for tracking upload progress

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      const response = await axios.post('http://localhost:5000/api/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          // Calculate and update progress percentage
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      alert('Video uploaded successfully!');
      setProgress(0); // Reset progress bar after successful upload
    } catch (err) {
      console.error(err);
      alert('Error uploading video.');
      setProgress(0); // Reset progress bar on failure
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Upload Video</h2>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Video File:</label>
          <input type="file" accept="" onChange={handleFileChange} required />
        </div>
        <button type="submit">Upload</button>
      </form>

      {/* Progress bar */}
      {progress > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div
            style={{
              height: '20px',
              background: '#ccc',
              borderRadius: '10px',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: '#4caf50',
                textAlign: 'center',
                lineHeight: '20px',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {progress}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
