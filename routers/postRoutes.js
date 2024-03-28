const express = require('express');
const PostController = require('../controllers/postController');

const router = express.Router();
// const upload = require('../middleware/upload')

router.post('/add', PostController.savePost);

// router.post('/uploadAvatar/:id', upload.single("avatar"),  UserController.uploadUserAvatar);


module.exports = router;
