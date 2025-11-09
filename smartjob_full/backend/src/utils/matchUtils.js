function dot(a,b){ return a.reduce((s,v,i)=>s+v*(b[i]||0),0); }
function norm(a){ return Math.sqrt(a.reduce((s,v)=>s+v*v,0)); }
function cosine(a,b){ return dot(a,b)/(norm(a)*norm(b)+1e-9); }

function computeSkillOverlap(jobSkills, candSkills){
  if(!jobSkills || jobSkills.length===0) return 0;
  const jobSet = new Set(jobSkills.map(s=>s.toLowerCase()));
  const candSet = new Set((candSkills||[]).map(s=>s.toLowerCase()));
  let inter = 0; for(const s of jobSet) if(candSet.has(s)) inter++;
  return inter / jobSet.size;
}

function computeExperienceScore(candidateYears, minYears){
  if(!minYears) return 1;
  if(candidateYears >= minYears) return 1;
  return candidateYears / minYears;
}

function locationMatch(jobLoc, candLoc){
  if(!jobLoc || !candLoc) return 0.5;
  if(jobLoc.country && candLoc.country && jobLoc.country.toLowerCase() === candLoc.country.toLowerCase()){
    if(jobLoc.city && candLoc.city && jobLoc.city.toLowerCase() === candLoc.city.toLowerCase()) return 1;
    return 0.8;
  }
  return 0;
}

function computeScore({embSim, skillOverlap, expScore, locScore}, weights){
  const { w1=0.6, w2=0.25, w3=0.1, w4=0.05 } = weights || {};
  return (w1*embSim) + (w2*skillOverlap) + (w3*expScore) + (w4*locScore);
}

module.exports = { cosine, computeSkillOverlap, computeExperienceScore, locationMatch, computeScore };
