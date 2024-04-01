const express = require('express');
const UserController = require('../controllers/userControllers');
const { verifyAccessToken } = require('../middleware/verifyToken');

const router = express.Router();

router.post('/register', UserController.createUser);
router.post('/login', UserController.login);
router.get('/getCurrent', verifyAccessToken, UserController.getCurrent)
router.post('/refreshToken', UserController.refreshAccesstoken)
router.get('/logout', UserController.logout)
router.post('/checkAddress', UserController.checkAddressExist)
router.get('/getAvatar/:id', UserController.getUserAvatar)
router.post('/uploadAvatar/:id',  UserController.uploadUserAvatar);

module.exports = router;
