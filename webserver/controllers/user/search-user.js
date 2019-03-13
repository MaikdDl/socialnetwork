'use strict';

const Joi = require('joi');
const UserModel = require('../../../models/user-model');

/**
 * Validate if search data is valid
 * @param {Object} payload Object to be validated. { q: String to search }
 * @return {Object} null if data is valid, throw an Error if data is not valid
 */

async function validate(payload) {
  const schema = {
    q: Joi.string().min(3).max(128).required(),
  };
  return Joi.validate(payload, schema);
}


async function searchUser(req, res, next) {
  const { q } = req.query;

  try {
    await validate({ q });
  } catch (e) {
    return res.status(400).send(e);
  }

  const op = {
    $text: {
      $search: q,
    },
  };
  try {
    const users = await UserModel.find(op);

    return res.send(users);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = searchUser;
