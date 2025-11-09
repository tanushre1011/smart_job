const Queue = require('bull');
const axios = require('axios');
const Resume = require('../models/Resume');
const embQueue = require('./embeddingWorker').embQueue;
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const parseQueue = new Queue('parse', redisUrl);

parseQueue.process(async (job) => {
  const { resumeId, s3Key, filePath } = job.data;
  try{
    const parserUrl = process.env.PARSER_URL || 'http://localhost:8000/parse';
    const FormData = require('form-data');
    const fs = require('fs');
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    const r = await axios.post(parserUrl, form, { headers: form.getHeaders(), timeout: 120000 });
    const parsed = r.data;
    await Resume.findByIdAndUpdate(resumeId, { parsedData: parsed, parseStatus: 'done' });
    if(parsed && parsed.rawText){
      await embQueue.add({ sourceType: 'resume', sourceId: resumeId, text: parsed.rawText });
    }
  } catch(err){
    await Resume.findByIdAndUpdate(resumeId, { parseStatus: 'error', error: err.message });
    throw err;
  }
});

module.exports = { parseQueue };
