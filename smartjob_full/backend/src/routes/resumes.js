const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middlewares/auth');
const Resume = require('../models/Resume');
const { addParseJob } = require('../workers/queue');

const upload = multer({ dest: '/tmp/uploads', limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/upload', auth, upload.single('resume'), async (req, res, next) => {
  try{
    const file = req.file;
    const doc = await Resume.create({ userId: req.user._id, originalFileName: file.originalname, parseStatus: 'pending' });
    await addParseJob({ resumeId: doc._id, filePath: file.path });
    res.json({ resumeId: doc._id, status: 'queued' });
  }catch(err){ next(err); }
});

router.get('/:id', auth, async (req, res, next) => {
  try{
    const r = await Resume.findById(req.params.id).lean();
    res.json(r);
  }catch(err){ next(err); }
});

module.exports = router;
