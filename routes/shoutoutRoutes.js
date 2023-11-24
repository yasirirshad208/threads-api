const { updateShoutoutPrice, requestShoutout, updateRequestStatus, updateShoutoutStatus, getAllRequestedShoutout } = require("../controllers/shoutout");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = require('express').Router();

router.post('/request/create', isAuthenticatedUser, requestShoutout)

router.put('/request/status/update', isAuthenticatedUser, updateRequestStatus)

// update shoutout status of user
router.put('/user/status/update', isAuthenticatedUser, updateShoutoutStatus)

router.put('/user/status/update', isAuthenticatedUser, updateShoutoutPrice)

router.get('/requests/all', isAuthenticatedUser, getAllRequestedShoutout)

module.exports = router