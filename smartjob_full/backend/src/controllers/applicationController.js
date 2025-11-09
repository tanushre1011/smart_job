const Application = require('../models/Application');
const Joi = require('joi');

const applySchema = Joi.object({
  jobId: Joi.string().required(),
  resumeId: Joi.string().required(),
  coverLetter: Joi.string().allow('', null)
});

exports.apply = async (req,res,next) => {
  try{
    const { error, value } = applySchema.validate(req.body);
    if(error) return res.status(400).json({ message: error.message });
    const { jobId, resumeId, coverLetter } = value;
    const exists = await Application.findOne({ jobId, candidateId: req.user._id });
    if (exists) return res.status(400).json({ message: 'Already applied' });
    const app = await Application.create({ jobId, candidateId: req.user._id, resumeId, status: 'Applied', statusHistory: [{ status:'Applied', changedBy: req.user._id, changedAt: new Date() }], coverLetter });
    res.json(app);
  } catch(err){ next(err); }
};

exports.getApplicationsForJob = async (req,res,next) => {
  try{
    const apps = await Application.find({ jobId: req.params.jobId }).populate('candidateId','name email profile').lean();
    res.json(apps);
  } catch(err){ next(err); }
};

exports.updateStatus = async (req,res,next) => {
  try{
    const { id } = req.params;
    const { status, note } = req.body;
    const app = await Application.findById(id);
    app.status = status;
    app.statusHistory.push({ status, changedBy: req.user._id, changedAt: new Date(), note });
    await app.save();
    res.json(app);
  } catch(err){ next(err); }
};
