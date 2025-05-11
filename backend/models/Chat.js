const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  user: { type: String, required: true },
  messages: [{ role: String, content: String }]
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
