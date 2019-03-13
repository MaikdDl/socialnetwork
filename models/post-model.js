'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  owner: String,
  author: String,
  content: String,
  likes: [String],
  comments: [{
    author: String,
    message: String,
    createdAt: Date,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: Date,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
