const { registerUser, login, forgotPassword, resetPassword, searchUsers, getSingleUser, updateAvatar, checkUsername, checkphone, editProfile, resendOtp, verifyOtp, suggestUser } = require('../controllers/user');

const router = require('express').Router();

const passport = require('passport');
const { isAuthenticatedUser } = require('../middleware/auth');
const upload  = require('../middleware/multer');

router.post('/register', registerUser)

router.put('/resend/otp', resendOtp)

router.put('/otp/verification', verifyOtp)

router.put('/update/avatar', isAuthenticatedUser, upload.single('avatar'), updateAvatar)

router.get('/check/username', checkUsername)

router.get('/check/phone', checkphone)

router.post('/login', login)

router.post('/forgotpassword', resendOtp);

router.put('/password/reset', resetPassword);

router.put('/edit/profile/:id', isAuthenticatedUser, editProfile);

router.get('/search',isAuthenticatedUser, searchUsers);

router.get('/get/single/:id?',isAuthenticatedUser, getSingleUser);

router.get('/suggest',isAuthenticatedUser, suggestUser);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/profile', failureRedirect: '/' }));

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/profile', failureRedirect: '/' }));

router.get('/auth/apple', passport.authenticate('apple', { scope: ['email'] }));
router.get('/auth/apple/callback', passport.authenticate('apple', { successRedirect: '/profile', failureRedirect: '/' }));

router.get('/profile', );

module.exports = router;
