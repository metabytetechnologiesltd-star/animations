#!/usr/bin/env node
/* Additive feature verification for React19/R3F9 modern engine, or legacy React18/R3F8. */
const fs=require("node:fs"),path=require("node:path");
const root=process.cwd();
const pkg=(name)=>{const p=path.join(root,"node_modules",...name.split("/"),"package.json");if(!fs.existsSync(p))throw Error("Missing "+name);const {version}=JSON.parse(fs.readFileSync(p,"utf8"));console.log("VERIFIED",name,version);return version;};
const React=pkg("react"),Fiber=pkg("@react-three/fiber");
const modern=React.startsWith("19.")&&Fiber.startsWith("9.");
const legacy=React.startsWith("18.")&&Fiber.startsWith("8.");
if(!modern&&!legacy)throw Error("Unsupported React/R3F pair: "+React+" / "+Fiber);
for(const name of ["@theatre/core","@theatre/studio","@react-three/postprocessing","postprocessing","gsap","three","remotion","@remotion/three"])pkg(name);
if(legacy)pkg("@theatre/r3f");
else{
  if(fs.existsSync(path.join(root,"node_modules","@theatre","r3f")))throw Error("Theatre @theatre/r3f ^8 is incompatible with modern Fiber9; use core + isolated legacy editor");
  if(!pkg("@react-three/postprocessing").startsWith("3."))throw Error("Modern React19 postprocessing 3.x expected");
}
const gsap=require(path.join(root,"node_modules","gsap")).gsap;
const obj={x:0};const timeline=gsap.timeline({paused:true}).to(obj,{x:10,duration:1,ease:"none"});
timeline.seek(.5,false);if(Math.abs(obj.x-5)>.01)throw Error("GSAP deterministic seeking failed");
console.log("GSAP_DETERMINISTIC_SEEK_OK",obj.x);
console.log("PIPELINE_ADDONS_VERIFIED",modern?"React19/R3F9":"React18/R3F8");
