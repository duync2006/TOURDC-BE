const express = require('express');
const PostController = require('../controllers/postController');

const router = express.Router();
// const upload = require('../middleware/upload')

router.post('/add', PostController.savePost);
router.post('/getCheckInPosts', PostController.getAllCheckInPosts);
router.post('/updateReview', PostController.updateStatus)

router.post('/uploadImgs', PostController.uploadImages)
router.get('/getImgs/:postID',PostController.getPostImgs)
router.get('/getImg/:picture', PostController.getImg)

module.exports = router;
