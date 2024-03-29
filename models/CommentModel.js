const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  createdAt: { type: Date, default: Date.now },
  originalCreatedAt: { type: Date }, // Ajoutez la date de création initiale
  authorName: { type: String },
  authorImage: { type: Buffer },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
