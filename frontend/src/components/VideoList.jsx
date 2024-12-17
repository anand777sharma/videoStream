import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos');
        setVideos(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div>
      <h2>Available Videos</h2>
      <Link to="/upload">Upload New Video</Link>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
        {videos.map((video) => (
          <div key={video._id} style={{ width: '200px', textAlign: 'center' }}>
            <Link to={`/video/${video._id}`}>
              <img
                src={`http://localhost:5000/uploads/${video.filePath.replace(/^uploads\//, '').replace(/.mp4$/, '.jpg')}`}
                alt={video.title}
                style={{ width: '100%' }}
              />
              <h4>{video.title}</h4>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
