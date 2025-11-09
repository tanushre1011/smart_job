const Job = require('../models/Job');
const Joi = require('joi');

const jobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  requirements: Joi.array().items(Joi.string()).default([]),
  location: Joi.object({ city: Joi.string(), state: Joi.string(), country: Joi.string() }).default({}),
  minExperienceYears: Joi.number().integer().min(0).default(0),
  maxExperienceYears: Joi.number().integer().min(0).allow(null),
  tags: Joi.array().items(Joi.string()).default([])
});

exports.createJob = async (req,res,next) => {
  try{
    const { error, value } = jobSchema.validate(req.body);
    if(error) return res.status(400).json({ message: error.message });
    value.companyId = req.user._id;
    const job = await Job.create(value);
    res.json(job);
  } catch(err){ next(err); }
};

exports.listJobs = async (req,res,next) => {
  try{
    const { q, tags, location, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (tags) filter.tags = { $in: tags.split(',') };
    if (location) filter['location.city'] = new RegExp(location,'i');
    if (q) filter.$text = { $search: q };
    const jobs = await Job.find(filter)
      .skip((page-1)*limit)
      .limit(parseInt(limit))
      .lean();
    res.json({ jobs });
  } catch(err){ next(err); }
};

exports.getJob = async (req,res,next) => {
  try{ const job = await Job.findById(req.params.id).lean(); res.json(job); } catch(err){ next(err);} };

exports.updateJob = async (req,res,next) => { try{ const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new:true }); res.json(job);} catch(err){next(err);} };

exports.deleteJob = async (req,res,next) => { try{ await Job.findByIdAndDelete(req.params.id); res.json({ ok:true }); } catch(err){ next(err);} };
