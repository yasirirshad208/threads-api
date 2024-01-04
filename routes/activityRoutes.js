const { getAllActivities } = require('../controllers/activity');
const { isAuthenticatedUser } = require('../middleware/auth');

const router  = require('express').Router();

router.get('/get/all', isAuthenticatedUser, getAllActivities)

module.exports = router