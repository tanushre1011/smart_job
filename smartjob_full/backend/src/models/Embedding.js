const mongoose = require('mongoose');

const embSchema = new mongoose.Schema({
  sourceType: { type: String, enum: ['job','resume','profile'], required: true },
  sourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  vector: { type: Array, default: [] },
  textSnippet: String
}, { timestamps: true });

module.exports = mongoose.model('Embedding', embSchema);
