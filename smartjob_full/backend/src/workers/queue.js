const parse = require('./parseWorker').parseQueue;
const emb = require('./embeddingWorker').embQueue;

async function addParseJob(payload){ await parse.add(payload, { attempts: 3, backoff: 5000 }); }
async function addEmbeddingJob(payload){ await emb.add(payload, { attempts: 3, backoff: 5000 }); }

module.exports = { addParseJob, addEmbeddingJob };
