'use strict';

/**
* 2. Hacer endpoint GET /api/user/friends que devuelva el array de amigos (uuid,
* fullName, avatarUrl) ... confirmedAt es distinto de null
*/
const Joi = require('joi');
const UserModel = require('../../../models/user-model');

async function validate(payload) {
  const schema = {
    uuid: Joi.string().guid({
      version: ['versionv4'],
    }),
  };
  return Joi.validate(payload, schema);
}

async function getFriends(req, res, next) {
  const friendsList = { ...req.body };
  const { uuid } = req.claims;
  debugger;
  try {
    await validate({ uuid });
  } catch (e) {
    return res.status(400).send();
  }

  const filter = {
    uuid: uuid.uuid,
    'friends.confirmedAt': !null,
  };

  const projection = {
    uuid: 1,
    avatarUrl: 1,
    fullName: 1,
    _id: 0,
  };

  try {
    const confirmedFriends = await UserModel.findOne(filter, projection);

    return res.status(204).send(confirmedFriends);
  } catch (e) {
    return res.status(500).send();
  }
}

module.exports = getFriends;
