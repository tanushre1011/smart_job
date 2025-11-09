const Queue = require('bull');
const Embedding = require('../models/Embedding');
const { OpenAI } = require('openai');
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const embQueue = new Queue('embedding', redisUrl);

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

embQueue.process(async (job) => {
  const { sourceType, sourceId, text } = job.data;
  try{
    // Call OpenAI embeddings API (text-embedding-3-small or text-embedding-3-large)
    const resp = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8192)
    });
    const vector = resp.data[0].embedding;
    await Embedding.create({ sourceType, sourceId, vector, textSnippet: text.slice(0,200) });
  } catch(err){
    console.error('Embedding job failed', err.message || err);
    throw err;
  }
});

module.exports = { embQueue };
