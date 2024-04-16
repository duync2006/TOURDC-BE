const express = require('express');
const UserController = require('../controllers/userControllers');
const { verifyAccessToken } = require('../middleware/verifyToken');

const router = express.Router();

router.post('/register', UserController.createUser);
router.post('/login', UserController.login);
router.post('/getCurrent', UserController.getCurrent)
router.post('/refreshToken', UserController.refreshAccesstoken)
router.get('/logout', UserController.logout)
router.post('/checkAddress', UserController.checkAddressExist)
router.get('/getAvatar/:address', UserController.getUserAvatar)
router.post('/uploadAvatar/:address',  UserController.uploadUserAvatar);
router.post('/getShareKey/',  UserController.getShareKey);
router.post('/getPrivateEnc/',  UserController.getPrivateKey);

module.exports = router;
