const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
  status: { type: String, enum: ['Applied','Screening','Interview','Offer','Hired','Rejected'], default: 'Applied' },
  statusHistory: [{ status: String, changedBy: mongoose.Schema.Types.ObjectId, changedAt: Date, note: String }],
  coverLetter: String
},{ timestamps: true });
module.exports = mongoose.model('Application', applicationSchema);
