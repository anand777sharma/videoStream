import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import VideoList from './components/VideoList';
import VideoPlayer from './components/VideoPlayer';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Video Streaming Platform</h1>
        <Routes>
          <Route path="/" element={<VideoList />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
