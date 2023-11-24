const { createPost, getAllPosts, editPost, deletePost, likePost, unLikePost, sharePost, getAllUserPosts, getPost, uploadPostImage } = require('../controllers/post');

const { isAuthenticatedUser } = require('../middleware/auth');

const upload  = require('../middleware/multer');

const router = require('express').Router();

router.post('/create',isAuthenticatedUser, createPost);

router.get('/getAll',isAuthenticatedUser, getAllPosts)

router.post('/media/upload', isAuthenticatedUser, upload.single('media'), uploadPostImage)

// router.put('/edit/:id', isAuthenticatedUser, upload.single('media'), editPost)

// router.delete('/delete/:id', isAuthenticatedUser, deletePost)

router.put('/like/:id', isAuthenticatedUser, likePost)

router.put('/unlike/:id', isAuthenticatedUser, unLikePost)

router.post('/share/:id', isAuthenticatedUser, sharePost)

router.get('/get/:id', isAuthenticatedUser, getPost)

router.get('/user/getAll/:userId', isAuthenticatedUser, getAllUserPosts)


module.exports = router