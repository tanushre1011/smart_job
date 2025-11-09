const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartjob';
  await mongoose.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true});
  console.log('MongoDB connected');
};
