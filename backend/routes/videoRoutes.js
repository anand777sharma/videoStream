const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');

const router = express.Router();

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload video
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const video = new Video({
      title,
      description,
      filePath: req.file.path,
    });
    await video.save();
    res.status(201).json({ message: 'Video uploaded successfully', video });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stream video
router.get('/stream/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const filePath = path.resolve(video.filePath);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload-chunk', (req, res) => {
  const { chunkIndex, totalChunks, fileName } = req.body;
  const chunk = req.file;

  // Append chunk to a temporary file
  const tempFilePath = `uploads/temp_${fileName}`;
  fs.appendFileSync(tempFilePath, chunk.buffer);

  // If this is the last chunk, rename the temp file
  if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
    const finalFilePath = `uploads/${fileName}`;
    fs.renameSync(tempFilePath, finalFilePath);
    return res.status(200).json({ message: 'Upload complete', filePath: finalFilePath });
  }

  res.status(200).json({ message: 'Chunk uploaded' });
});


module.exports = router;

