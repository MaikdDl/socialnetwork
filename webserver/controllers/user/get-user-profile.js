'use strict';

const userModel = require('../../../models/user-model');

async function getUserProfile(req, res, next) {
  const { uuid } = req.claims;

  try {
    const newUser = await userModel.findOne({ uuid }, '-_id -__v');

    return res.status(200).send(newUser);
  } catch (e) {
    return res.status(401).send();
  }


  // return res.send(req.claims);
}

module.exports = getUserProfile;
