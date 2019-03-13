'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = mongoose.Schema.Types;

const WallSchema = new Schema({
  uuid: {
    type: String,
    unique: true,
  },
  posts: [ObjectId],
});

const Wall = mongoose.model('Wall', WallSchema);

module.exports = Wall;
