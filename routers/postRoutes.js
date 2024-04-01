const express = require('express');
const PostController = require('../controllers/postController');

const router = express.Router();
// const upload = require('../middleware/upload')

router.post('/add', PostController.savePost);
router.post('/getCheckInPosts', PostController.getAllCheckInPosts);

router.post('/uploadImgs', PostController.uploadImages)


module.exports = router;
