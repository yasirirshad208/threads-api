const { likeReReply, unLikeReReply, replyPost, editReply, deleteReply, likeReply, unLikeReply, getAllReplies, getUserRepliesOnPosts, reReplyOfReply, editReReply, deleteReReply } = require('../controllers/reply');
const { isAuthenticatedUser } = require('../middleware/auth');

const router = require('express').Router();

router.post('/create', isAuthenticatedUser, replyPost)

router.put('/edit', isAuthenticatedUser, editReply)

router.delete('/delete', isAuthenticatedUser, deleteReply)

router.put('/like/:id', isAuthenticatedUser, likeReply)

router.put('/unlike/:id', isAuthenticatedUser, unLikeReply)

router.get('/getAll/:postId', isAuthenticatedUser, getAllReplies)

router.get('/get/all/onPosts/:userId', isAuthenticatedUser, getUserRepliesOnPosts)

router.post('/reReply/create', isAuthenticatedUser, reReplyOfReply)

router.put('/reReply/edit', isAuthenticatedUser, editReReply)

router.delete('/reReply/delete', isAuthenticatedUser, deleteReReply)

router.put('/reReply/like', isAuthenticatedUser, likeReReply)

router.put('/reReply/unlike', isAuthenticatedUser, unLikeReReply)


module.exports = router