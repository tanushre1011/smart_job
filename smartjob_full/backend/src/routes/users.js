const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/userController');

router.get('/me', auth, ctrl.getMe);
router.put('/me', auth, ctrl.updateMe);

module.exports = router;
