#!/usr/bin/env node
/*
 * Additive feature-install verification for existing React18 / R3F8 film pipeline.
 * Leaves Blender -> Three -> Remotion -> ElevenLabs -> FFmpeg untouched.
 * This is a dependency smoke test, not proof that a particular cinematic effect is integrated.
 */
const fs=require("node:fs");
const path=require("node:path");
const installed=[
 ["@theatre/core","Theatre.js timeline"],
 ["@theatre/r3f","Theatre.js Three Fiber integration"],
 ["@theatre/studio","Theatre.js authoring studio (optional dev only)"],
 ["@react-three/postprocessing","React three postprocessing"],
 ["postprocessing","Postprocessing core"],
 ["gsap","GSAP choreography"],
 ["react","Existing React"],
 ["@react-three/fiber","Existing R3F"],
 ["three","Existing Three.js"],
 ["remotion","Existing Remotion"]
];
let count=0;
for(const [pkg,why] of installed){
 const p=path.join(process.cwd(),"node_modules",...pkg.split("/"),"package.json");
 if(!fs.existsSync(p))throw Error("Missing expected installed dependency: "+pkg);
 const {version}=JSON.parse(fs.readFileSync(p,"utf8"));
 console.log("VERIFIED",pkg,version,"—",why);
 count++;
}
const react=JSON.parse(fs.readFileSync("node_modules/react/package.json","utf8")).version;
const fiber=JSON.parse(fs.readFileSync("node_modules/@react-three/fiber/package.json","utf8")).version;
if(!react.startsWith("18.")||!fiber.startsWith("8."))throw Error("Original React18/R3F8 stack must remain unchanged");
const gsap = require(path.join(process.cwd(),"node_modules","gsap")).gsap;
const object={x:0};
const animation=gsap.timeline({paused:true}).to(object,{x:10,duration:1,ease:"none"});
animation.seek(.5,false);
if(Math.abs(object.x-5)>.01)throw Error("GSAP deterministic seeking failed");
console.log("GSAP_FRAME_SEEK_OK",object.x);
console.log("ANIMATION_TOOLCHAIN_ADDONS_VERIFIED",count);
