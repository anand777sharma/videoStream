import React from 'react';
import { useParams } from 'react-router-dom';

const VideoPlayer = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Video Player</h2>
      <video
        controls
        style={{ width: '100%', maxWidth: '800px', margin: '0 auto', display: 'block' }}
      >
        <source src={`http://localhost:5000/api/videos/stream/${id}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
