'use strict';

const PostModel = require('../../../models/post-model');
const WallModel = require('../../../models/wall-model');

/**
 * Return a collection of posts
 * @param {Array} postIds PostId in ObjectId format
 * @return {Array} Post objects from post model
 */
async function getPostsById(postIds) {
  const filter = {
    _id: {
      $in: postIds,
    },
    deletedAt: null,
  };

  const posts = await PostModel.find(filter);

  return posts;
}

async function getUserWall(req, res, next) {
  const { uuid } = req.claims;

  const filter = {
    uuid,
  };

  const projection = {
    _id: 0,
    posts: 1,
  };

  try {
    const wall = await WallModel.findOne(filter, projection);
    if (!wall) {
      return {
        data: [],
      };
    }

    const posts = await getPostsById(wall.posts);

    const response = {
      data: posts,
    };

    return res.send(response);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getUserWall;
