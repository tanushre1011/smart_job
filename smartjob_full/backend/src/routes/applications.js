const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/applicationController');

router.post('/apply', auth, ctrl.apply);
router.get('/job/:jobId', auth, ctrl.getApplicationsForJob);
router.patch('/:id/status', auth, ctrl.updateStatus);

module.exports = router;
