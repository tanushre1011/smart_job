const Embedding = require('../models/Embedding');
const User = require('../models/User');
const Job = require('../models/Job');
const { cosine, computeScore, computeSkillOverlap, computeExperienceScore, locationMatch } = require('../utils/matchUtils');

exports.matchForJob = async (req,res,next) => {
  try{
    const job = await Job.findById(req.params.jobId).lean();
    const jobEmbDoc = await Embedding.findOne({ sourceType: 'job', sourceId: job._id });
    if(!jobEmbDoc) return res.status(400).json({ message: 'Job embedding not available' });
    const candidates = await User.find({ role: 'candidate' }).lean();
    const results = [];
    for (const c of candidates){
      const emb = await Embedding.findOne({ sourceType: 'resume', sourceId: { $in: c.resumeIds } });
      if(!emb) continue;
      const embSim = cosine(jobEmbDoc.vector, emb.vector);
      const skillOverlap = computeSkillOverlap(job.requirements || [], c.profile && c.profile.skills ? c.profile.skills : []);
      const expScore = computeExperienceScore((c.profile && c.profile.experienceYears) || 0, job.minExperienceYears || 0);
      const locScore = locationMatch(job.location, c.profile && c.profile.location);
      const score = computeScore({ embSim, skillOverlap, expScore, locScore }, req.body.weights || {});
      results.push({ candidateId: c._id, score, embSim, skillOverlap, expScore, locScore });
    }
    results.sort((a,b) => b.score - a.score);
    res.json({ jobId: job._id, matches: results.slice(0,50) });
  } catch(err){ next(err); }
};

exports.matchForCandidate = async (req,res,next) => {
  try{
    const user = await User.findById(req.params.userId).lean();
    const emb = await Embedding.findOne({ sourceType: 'resume', sourceId: { $in: user.resumeIds } });
    if (!emb) return res.status(400).json({ message: 'Candidate embeddings not available' });
    const jobEmbeds = await Embedding.find({ sourceType: 'job' }).lean();
    const jobs = await Job.find({ isActive: true }).lean();
    const mapping = {};
    jobEmbeds.forEach(j => mapping[j.sourceId.toString()] = j);
    const results = [];
    for(const j of jobs){
      const jemb = mapping[j._id.toString()];
      if(!jemb) continue;
      const embSim = cosine(emb.vector, jemb.vector);
      const skillOverlap = computeSkillOverlap(j.requirements || [], user.profile && user.profile.skills ? user.profile.skills : []);
      const expScore = computeExperienceScore((user.profile && user.profile.experienceYears) || 0, j.minExperienceYears || 0);
      const locScore = locationMatch(j.location, user.profile && user.profile.location);
      const score = computeScore({ embSim, skillOverlap, expScore, locScore }, req.body.weights || {});
      results.push({ jobId: j._id, score, embSim, skillOverlap, expScore, locScore });
    }
    results.sort((a,b) => b.score - a.score);
    res.json({ userId: user._id, matches: results.slice(0,50) });
  } catch(err){ next(err); }
};
