/* Saved Theatre.js 0.7 Core project state, authored as editable sequenced tracks.
 * Studio can open this project in the optional editor, but is excluded from production frame renders.
 * Every value is deterministic from the Remotion frame time.
 */
import {getProject} from "@theatre/core";
const points = {
  camX: [[0,5.3],[3.22,4.1],[3.24,1.8],[5.96,1.15],[5.98,3.1],[10.36,2.4],[10.38,3.5],[12.88,3.3],[12.90,.65],[16.85,.55],[16.87,1.75],[21,2.2]],
  camY: [[0,2.0],[3.22,1.45],[3.24,1.0],[5.96,.55],[5.98,.70],[10.36,.68],[10.38,.65],[12.88,.8],[12.90,.72],[16.85,.65],[16.87,1.15],[21,1.25]],
  camZ: [[0,8.2],[3.22,5.7],[3.24,3.5],[5.96,2.9],[5.98,4.5],[10.36,3.4],[10.38,2.6],[12.88,2.4],[12.90,2.3],[16.85,1.65],[16.87,5.5],[21,4.8]],
  aimX: [[0,0],[3.22,0],[3.24,.02],[5.96,0],[5.98,-.27],[10.36,-.15],[10.38,1.55],[12.88,1.55],[12.90,0],[16.85,0],[16.87,0],[21,0]],
  aimY: [[0,.10],[3.22,0],[3.24,.10],[5.96,.1],[5.98,.15],[10.36,.15],[10.38,.75],[12.88,.75],[12.90,.34],[16.85,.4],[16.87,.25],[21,.25]],
  aimZ: [[0,-3.9],[3.22,-3.9],[3.24,-2.75],[5.96,-2.65],[5.98,-4.4],[10.36,-4.4],[10.38,-1.2],[12.88,-1.2],[12.90,-4.9],[16.85,-4.9],[16.87,-4.2],[21,-4.3]],
  wheelTurn: [[0,0],[3.35,0],[4.2,.18],[5.8,6.283],[21,6.283]],
  doorOpen: [[0,0],[5.52,0],[6.0,.06],[7.7,1.16],[21,1.16]],
  touch: [[0,0],[3.05,0],[4.08,1],[5.85,1],[6.45,.2],[7.0,0],[21,0]],
  point: [[0,0],[6.52,0],[7.35,1],[9.9,1],[10.4,0],[21,0]],
  reflection: [[0,0],[15.25,0],[16.2,.45],[18.2,.9],[21,.9]]
};
const tracks={};
const map={};
for(const [prop,k] of Object.entries(points)){
 const trackName="track_"+prop;
 map[JSON.stringify([prop])]=trackName;
 tracks[trackName]={type:"BasicKeyframedTrack",__debugName:prop,keyframes:k.map(([position,value],i)=>({
 id:prop+"_kf_"+i,position,value,connectedRight:true,handles:[.4,1,.6,0]
 }))};
}
const state={
 sheetsById:{
  "Vault":{staticOverrides:{byObject:{}},sequence:{type:"PositionalSequence",subUnitsPerUnit:24,length:21,tracksByObject:{
   "Director":{trackIdByPropPath:map,trackData:tracks}
  }}}
 },
 definitionVersion:"0.4.0",
 revisionHistory:["hybridVaultOriginal_r1"]
};
export const project=getProject("The Impossible Frame - Cinematic Vault",{state});
export const sheet=project.sheet("Vault");
export const director=sheet.object("Director",Object.fromEntries(Object.keys(points).map(k=>[k,points[k][0][1]])));
export const baselineAt=t=>Object.fromEntries(Object.entries(points).map(([p,pts])=>{
 let a=pts[0],b=pts.at(-1);
 for(let i=0;i<pts.length-1;i++){if(t>=pts[i][0]&&t<=pts[i+1][0]){a=pts[i];b=pts[i+1];break;}}
 const x=Math.max(0,Math.min(1,(t-a[0])/Math.max(0.000001,b[0]-a[0])));
 return [p,a[1]+(b[1]-a[1])*(x*x*(3-2*x))];
}));
