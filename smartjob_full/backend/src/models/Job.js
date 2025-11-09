const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  requirements: [String],
  location: { city: String, state: String, country: String },
  minExperienceYears: Number,
  maxExperienceYears: Number,
  isActive: { type: Boolean, default: true },
  tags: [String]
},{ timestamps: true });
module.exports = mongoose.model('Job', jobSchema);
