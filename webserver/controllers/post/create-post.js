'use strict';

const Joi = require('joi');
const PostModel = require('../../../models/post-model');
const WallModel = require('../../../models/wall-model');


async function validate(payload) {
  const schema = {
    content: Joi.string().min(1).max(2000).required(),
  };

  return Joi.validate(payload, schema);
}

async function createPost(req, res, next) {
  const { claims } = req;
  const { uuid } = claims;

  /**
   *  1.1 Validamos datos
   */
  const postData = { ...req.body };

  try {
    await validate(postData);
  } catch (e) {
    return res.status(400).send(e);
  }

  const data = {
    owner: uuid,
    author: uuid,
    content: postData.content,
    likes: [],
    comments: [],
    deletedAt: null,
  };


  try {
    const postCreated = await PostModel.create(data);
    const postId = postCreated._id;


    const filter = {
      uuid,
    };

    const operation = {
      $addToSet: {
        posts: postId,
      },
    };

    const options = {
      upsert: true,
    };

    await WallModel.findOneAndUpdate(filter, operation, options);

    return res.status(201).send('El post se ha subido correctamente');
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

module.exports = createPost;
