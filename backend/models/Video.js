const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
});
VideoSchema.index({ filePath: 1 });


module.exports = mongoose.model('Video', VideoSchema);
