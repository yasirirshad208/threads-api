const { followUser, unfollowUser, bookmarkPost, unBookmarPost, getAllBokkmarkedPosts, muteUser, unMuteUser, blockUser, unBlockUser } = require('../controllers/userEngagement');
const { isAuthenticatedUser } = require('../middleware/auth');

const router = require('express').Router();

router.put('/follow',isAuthenticatedUser, followUser);

router.put('/unfollow',isAuthenticatedUser, unfollowUser);

router.put('/bookmark/post',isAuthenticatedUser, bookmarkPost);

router.put('/unbookmark/post',isAuthenticatedUser, unBookmarPost);

router.get('/bookmarked/get/all',isAuthenticatedUser, getAllBokkmarkedPosts);

router.put('/mute', isAuthenticatedUser, muteUser)

router.put('/unmute', isAuthenticatedUser, unMuteUser)

router.put('/block', isAuthenticatedUser, blockUser)

router.put('/unblock', isAuthenticatedUser, unBlockUser)

module.exports = router
