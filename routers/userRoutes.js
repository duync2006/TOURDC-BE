const express = require('express');
const UserController = require('../controllers/userControllers');

const router = express.Router();
const upload = require('../middleware/upload')

router.post('/register', UserController.createUser);

router.post('/uploadAvatar/:id', upload.single("avatar"),  UserController.uploadUserAvatar);


module.exports = router;
