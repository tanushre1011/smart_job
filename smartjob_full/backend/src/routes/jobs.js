const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const ctrl = require('../controllers/jobController');

router.post('/', auth, ctrl.createJob);
router.get('/', ctrl.listJobs);
router.get('/:id', ctrl.getJob);
router.put('/:id', auth, ctrl.updateJob);
router.delete('/:id', auth, ctrl.deleteJob);

module.exports = router;
