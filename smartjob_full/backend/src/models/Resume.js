const mongoose = require('mongoose');
const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalFileName: String,
  s3Key: String,
  parsedData: mongoose.Schema.Types.Mixed,
  parseStatus: { type: String, enum: ['pending','done','error'], default: 'pending' },
  error: String
},{ timestamps: true });
module.exports = mongoose.model('Resume', resumeSchema);
