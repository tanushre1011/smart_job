const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  headline: String,
  location: { city: String, state: String, country: String },
  skills: [String],
  experienceYears: Number,
  education: [{ degree: String, institution: String, startDate: Date, endDate: Date }]
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['candidate','recruiter','admin'], default: 'candidate' },
  profile: profileSchema,
  resumeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }]
},{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
