'use strict';

const express = require('express');
const multer = require('multer');

const getUserProfile = require('../controllers/user/get-user-profile');
const checkJwtToken = require('../controllers/session/check-jwt-token');
const updateUserProfile = require('../controllers/user/update-user-profile');
const uploadAvatar = require('../controllers/user/upload-avatar');
const searchUser = require('../controllers/user/search-user');
const addFriendRequest = require('../controllers/user/add-friend-request');
const getFriendRequests = require('../controllers/user/get-friend-requests');
const acceptFriendRequest = require('../controllers/user/accept-friend-request');
const getFriends = require('../controllers/user/get-friends');
const getUserWall = require('../controllers/user/get-user-wall');


const upload = multer();
const router = express.Router();

router.get('/user', checkJwtToken, getUserProfile);
router.put('/user', checkJwtToken, updateUserProfile);
router.post('/user/avatar', checkJwtToken, upload.single('avatar'), uploadAvatar);
router.get('/user/search', checkJwtToken, searchUser);
router.post('/user/friendrequest', checkJwtToken, addFriendRequest);
router.get('/user/friendrequest', checkJwtToken, getFriendRequests);
router.post('/user/friendrequest/accept', checkJwtToken, acceptFriendRequest);
router.get('/user/friends', checkJwtToken, getFriends);
router.get('/user/wall', checkJwtToken, getUserWall);

module.exports = router;
