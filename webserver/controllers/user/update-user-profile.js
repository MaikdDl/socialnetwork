'use strict';

const dot = require('dot-object');
const Joi = require('joi');
const UserModel = require('../../../models/user-model');

async function validate(payload) {
  const schema = {
    fullName: Joi.string().min(3).max(128).required(),
    preferences: Joi.object().keys({
      isPublicProfile: Joi.bool().required(),
      linkedIn: Joi.string().allow(null),
      twitter: Joi.string().allow(null),
      github: Joi.string().uri().allow(null),
      description: Joi.string().allow(null),
    }),
  };

  return Joi.validate(payload, schema);
}

async function updateUserProfile(req, res, next) {
  const userDataProfile = { ...req.body };
  const { claims } = req;
  /**
   *  1. validar datos
   */

  try {
    await validate(userDataProfile);
  } catch (e) {
    return res.status(400).send(e);
  }
  try {
    const userDataProfileMongoose = dot.dot(userDataProfile);
    const data = await UserModel.updateOne({ uuid: claims.uuid }, userDataProfileMongoose);
    console.log('mongoose data', data);
    return res.status(204).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

module.exports = updateUserProfile;
