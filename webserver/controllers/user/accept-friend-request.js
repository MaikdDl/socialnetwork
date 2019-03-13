'use strict';


const Joi = require('joi');
const UserModel = require('../../../models/user-model');


async function validate(payload) {
  const schema = {
    uuid: Joi.string().guid({
      version: ['uuidv4'],
    }),
  };
  return Joi.validate(payload, schema);
}

async function addConfirmFriend(friend, me) {

  /**
   * Yo, Miguel acepto a Jose como amigo entonces:
   * - Miguel en su listado de amigos tiene a Jose con confirmedAt: now
   * - Falta poner a MIGUEL (me) en el listado de amigos de jose (friend uuid)
   */

  const filter = {
    uuid: friend,
  };

  const now = Date.now();

  const op = {
    $push: {
      friends: {
        uuid: me,
        createdAt: now,
        confirmedAt: now,
        rejectedAt: null,
      },
    },
  };

  await UserModel.findOneAndUpdate(filter, op);

  // edge case, eliminar peticiones anteriores SI se hizo la request y nadie confirmó

  const deleteOp = {
    $pull: {
      friends: {
        uuid: me,
        confirmedAt: null,
      },
    },
  };

  await UserModel.findOneAndUpdate(filter, deleteOp);
}

async function acceptFriendRequest(req, res, next) {
  const { uuid: friendUuid } = req.body;
  const { uuid: me } = req.claims;

  try {
    await validate({ uuid: friendUuid });
  } catch (e) {
    return res.status(400).send(e);
  }
  /**
  * 2. Hacer endpoint GET /api/user/friends que devuelva el array de amigos (uuid,
    fullName, avatarUrl) ... confirmedAt es distinto de null
  */

  /**
   * tengo que buscar en mi usuario y mi array de friends, el amigo que me hizo la petición,
   * si se encuentra entonces actualizar el field confirmedAt
   */


  const filter = {
    uuid: me,
    'friends.uuid': friendUuid,
    'friends.confirmedAt': null,
  };


  const op = {
    $set: {
      'friends.$.confirmedAt': Date.now(),
    },
  };


  try {
    /**
     * rawResult sirve para ver los datos de mongo sin "mongoosear"
     * (sin pasar por el filtro "maǵico de mongoose")
     * */
    await UserModel.findOneAndUpdate(filter, op, { rawResult: true });

    await addConfirmFriend(friendUuid, me);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = acceptFriendRequest;
