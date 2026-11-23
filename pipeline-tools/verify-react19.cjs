#!/usr/bin/env node
// Production regression gate for React 19 + React Three Fiber 9.
// Deliberately strict: no --force, no --legacy-peer-deps.
const fs = require("node:fs");
const path = require("node:path");
const root = process.cwd();
const version=(pkg)=>JSON.parse(fs.readFileSync(path.join(root,"node_modules",...pkg.split("/"),"package.json"),"utf8")).version;
const deps = [
"react","react-dom","@react-three/fiber","@react-three/drei","three",
"remotion","@remotion/cli","@remotion/three","@react-three/postprocessing",
"postprocessing","gsap","@theatre/core","@theatre/studio"
];
for (const pkg of deps)console.log("INSTALLED",pkg,version(pkg));
if (!version("react").startsWith("19.") || !version("react-dom").startsWith("19."))throw Error("Expected React 19");
if (!version("@react-three/fiber").startsWith("9."))throw Error("Expected Fiber 9");
if (!version("@react-three/drei").startsWith("10."))throw Error("Expected Drei 10");
if (!version("@react-three/postprocessing").startsWith("3."))throw Error("Expected postprocessing 3");
if (!version("remotion").startsWith("4."))throw Error("Expected Remotion 4");
if (fs.existsSync(path.join(root,"node_modules/@theatre/r3f")))throw Error("Legacy Theatre R3F8 adapter must not be bundled into Fiber9 runtime");
const gsap = require(path.join(root,"node_modules/gsap")).gsap;
let obj = {value:0};
const timeline=gsap.timeline({paused:true}).to(obj,{value:100,duration:1,ease:"none"});
timeline.seek(0.37,false);
if (Math.abs(obj.value - 37) > 0.001)throw Error("GSAP frame seek regression: "+obj.value);
const theatre = require(path.join(root,"node_modules/@theatre/core"));
if (typeof theatre.getProject!=="function")throw Error("Theatre core unavailable");
console.log("THEATRE_CORE_AVAILABLE",typeof theatre.getProject);
console.log("GSAP_DETERMINISTIC_SEEK_OK",obj.value);
console.log("REACT19_R3F9_STRICT_SMOKE_OK");
