const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/matchController');

router.post('/job/:jobId', auth, ctrl.matchForJob);
router.post('/candidate/:userId', auth, ctrl.matchForCandidate);

module.exports = router;
