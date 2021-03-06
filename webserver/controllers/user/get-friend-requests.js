'use strict';

const UserModel = require('../../../models/user-model');

async function getFriendRequests(req, res, next) {
  const { uuid } = req.claims;

  /**
   * buscamos los ids de mis amigos / posibles amigos
   */
  const filter = {
    uuid,
  };

  const projection = {
    friends: 1,
    _id: 0,
  };

  try {
    const friendsResult = await UserModel.findOne(filter, projection); // [{ ...user1 },{ user2 },...,{user n}]
    const friendsUuids = friendsResult.friends.map(f => f.uuid); // [uuid1, uuid2, ..., uuid n]

    /**
    * 1. El endpoint de GET /api/user/friendrequests, hacer  que devuelva solo las pending friend
    * requests => mirar que rejectedAt y confirmedAt sean null
    */

    const filterRequests = {
      uuid: {
        $in: friendsUuids,
      },
      $and:
        [{ 'friends.confirmedAt': null },
        { 'friends.rejectedAt': null }],
    };

    const projectionFriendsData = {
      uuid: 1,
      avatarUrl: 1,
      fullName: 1,
      _id: 0,
    };

    const users = await UserModel.find(filterRequests, projectionFriendsData).lean();
    return res.send({
      data: users,
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}

module.exports = getFriendRequests;