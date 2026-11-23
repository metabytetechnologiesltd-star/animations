import React,{useLayoutEffect,useMemo} from "react";
import {registerRoot,Composition,useCurrentFrame,staticFile,Sequence,Audio,AbsoluteFill} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {useGLTF} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import * as T from "three";
const FPS=24,W=1280,H=720;
const cl=(x)=>Math.max(0,Math.min(1,x)),sm=(x)=>{x=cl(x);return x*x*(3-2*x)},lerp=(a,b,t)=>a+(b-a)*t;
function B({p,s,c,metal=0}){return <mesh position={p} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={c} metalness={metal} roughness={.56}/></mesh>}
function C({p,a,c,metal=0,opacity=1}){return <mesh position={p} castShadow receiveShadow><cylinderGeometry args={a}/><meshStandardMaterial color={c} metalness={metal} roughness={.45} transparent={opacity<1} opacity={opacity}/></mesh>}
function Arm({a,b,color="#315965",r=.11}){const u=new T.Vector3(...a),v=new T.Vector3(...b),d=v.clone().sub(u),q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize());return <mesh position={u.add(v).multiplyScalar(.5).toArray()} quaternion={q}><cylinderGeometry args={[r,r,d.length(),12]}/><meshStandardMaterial color={color}/></mesh>}
function Person({x,z,color,sex,sec,lift}){
 const move=sex==="inspector"?sm((sec-4.7)/2.0):sm((sec-10.9)/.9);
 const speak=sex==="inspector"?sec>8.3&&sec<10.95:sec>11&&sec<12.95;
 const face=sex==="inspector"?"#be8a70":"#b49a7b";
 const hand=sex==="inspector"?[lerp(x+.32,-.53,move),lerp(-1.08,-.26+lift*1.25,move),lerp(z+.5,.76,move)]:[lerp(x-.35,x-.72,move),lerp(-1.06,-.6,move),z+.6];
 const elbow=[lerp(x+.48,(x+hand[0])*.5,move),-.67,z+.5];
 const sh=[x+.33,-.36,z+.25];
 return <group>
  <C p={[x,-1.28,z]} a={[.30,.35,1.36,16]} c={color}/>
  <C p={[x,-.40,z]} a={[.47,.34,1.0,18]} c={color}/>
  <B p={[x,-.38,z+.34]} s={[.40,.67,.025]} c={sex==="inspector"?"#d7a751":"#566d80"}/>
  <mesh position={[x,.44,z+.09]} scale={[.36,.42,.36]}><sphereGeometry args={[1,26,18]}/><meshStandardMaterial color={face}/></mesh>
  <mesh position={[x,.74,z+.02]} scale={[.38,.17,.35]}><sphereGeometry args={[1,20,16]}/><meshStandardMaterial color={sex==="inspector"?"#302725":"#423225"}/></mesh>
  {[-.14,.14].map((dx,i)=><group key={i}>
     <mesh position={[x+dx,.51,z+.422]} scale={[.037,.041,.02]}><sphereGeometry args={[1,10,8]}/><meshStandardMaterial color="#141f28"/></mesh>
     <B p={[x+dx,.63,z+.41]} s={[.17,.023,.015]} c="#392a25"/>
  </group>)}
  <B p={[x,.26,z+.435]} s={[.12,speak?.055:.013,.018]} c="#4a2929"/>
  <Arm a={sh} b={elbow} color={color} r={.14}/><Arm a={elbow} b={hand} color={color}/>
  <mesh position={hand} scale={[.13,.11,.12]}><sphereGeometry args={[1,14,10]}/><meshStandardMaterial color={face}/></mesh>
  <Arm a={[x-.34,-.36,z+.18]} b={[x-.28,-1.13,z+.48]} color={color} r={.13}/>
 </group>;
}
function Barrels(){
 const model=useGLTF(staticFile("barrel.glb"));const barrels=useMemo(()=>Array.from({length:36},(_,i)=>model.scene.clone(true)),[model.scene]);
 return <group>{barrels.map((obj,i)=><primitive key={i} object={obj} position={[(i%12-5.5)*1.45,-1.29+Math.floor(i/12)*1.55,-5.9]}/>)}
   <primitive object={model.scene.clone(true)} position={[0,-1.12,.70]} scale={1.16}/>
 </group>;
}
function Lid({lift}){
 return <group position={[-.35*lift,-.28+1.26*lift,.70]} rotation={[0,0,-.28*lift]}>
    <C p={[0,0,0]} a={[.89,.89,.10,48]} c="#7a4b2b"/>
    <C p={[0,.07,0]} a={[.20,.20,.15,24]} c="#88999a" metal={.75}/>
    <mesh position={[0,.17,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.14,.035,8,20]}/><meshStandardMaterial color="#c3bd9f" metalness={.66}/></mesh>
 </group>;
}
function Set({sec}){
 const lift=sm((sec-7.3)/1.25);
 return <group>
  <B p={[0,-2.20,-2]} s={[60,.17,60]} c="#2d3540"/>
  <B p={[0,3,-9]} s={[50,14,.14]} c="#112932"/>
  {Array.from({length:12},(_,i)=><B key={i} p={[(i-5.5)*1.5,1.3,-6.6]} s={[.12,6,.20]} c="#596167" metal={.65}/>)}
  {[-1.95,-.30,1.27,2.83].map((y,i)=><B key={i} p={[0,y,-6.4]} s={[32,.14,.30]} c="#716350" metal={.6}/>)}
  {[-5,0,5].map((x,i)=><group key={i}><B p={[x,4.2,-4.7]} s={[.85,.10,1.2]} c="#efb65a"/><pointLight position={[x,3.7,-4.7]} intensity={55} distance={11} decay={2} color="#ffc57a"/></group>)}
  <Barrels/>
  <C p={[0,-.31,.70]} a={[.72,.72,.035,42]} c="#4ad1e4" metal={.25} opacity={cl(lift*1.7)}/>
  <Lid lift={lift}/>
  <Person x={-1.72} z={.27} color="#315c67" sex="inspector" sec={sec} lift={lift}/>
  <Person x={2.22} z={-.38} color="#46596a" sex="colleague" sec={sec} lift={lift}/>
  <B p={[-2.6,-1.86,1.3]} s={[.62,.035,.43]} c="#ceb98e"/>
  <B p={[2.93,-1.86,1.3]} s={[.62,.045,.42]} c="#876c50"/>
  {Array.from({length:10},(_,i)=>{const phase=sec*2.8-i*.20;return phase>8&&phase<10?<mesh key={i} position={[(i%4-.9)*.14,-.26+(phase-8)*.22,.62]} scale={[.04,.08,.04]}><sphereGeometry args={[1,9,8]}/><meshStandardMaterial color="#8ad1df" transparent opacity={.6}/></mesh>:null})}
 </group>;
}
function Cam({sec}){
 const {camera}=useThree();
 useLayoutEffect(()=>{
  let p,t;
  if(sec<3){const k=sec/3;p=[lerp(8,5.8,k),lerp(4.5,3.1,k),lerp(12,8.5,k)];t=[0,-.3,-2]}
  else if(sec<7.3){const k=(sec-3)/4.3;p=[lerp(5.1,3,k),lerp(1.8,.8,k),lerp(8.1,5.1,k)];t=[-.4,-.6,.1]}
  else if(sec<11){const k=(sec-7.3)/3.7;p=[lerp(3,1.65,k),lerp(.8,.35,k),lerp(5,3.5,k)];t=[-.4,-.5,.60]}
  else if(sec<13.2){p=[3,1.1,5.3];t=[1.5,.11,-.38]}
  else {const k=cl((sec-13.2)/6.8);p=[lerp(3,9.8,k),lerp(1.1,5.3,k),lerp(6,14,k)];t=[0,.28,-3]}
  camera.position.set(...p);camera.lookAt(...t);camera.updateProjectionMatrix();
 },[camera,sec]);return null;
}
function Scene(){const sec=useCurrentFrame()/FPS;return <ThreeCanvas width={W} height={H} style={{position:"absolute",inset:0}} camera={{fov:39,position:[7,4,12],near:.1,far:80}} gl={{antialias:true,preserveDrawingBuffer:true}}>
  <color attach="background" args={["#071823"]}/><fog attach="fog" args={["#071823",11,31]}/>
  <ambientLight intensity={1.05} color="#88a5b7"/>
  <directionalLight position={[5,7,7]} intensity={2.6} color="#efc08a"/>
  <pointLight position={[-2,2,4]} intensity={50} color="#efc184" decay={2} distance={9}/>
  <pointLight position={[4,4,-4]} intensity={35} color="#66badd" decay={2} distance={13}/>
  <Set sec={sec}/><Cam sec={sec}/>
 </ThreeCanvas>}
function Overlay({sec,frame}){
 const s=sec;
 let who,cap;
 if(s<8.32){who="NARRATOR";cap="July 2012. An inspector checked Canada's maple syrup reserve..."}
 else if(s<11){who="INSPECTOR";cap="It's water. Not syrup."}
 else if(s<13.2){who="WAREHOUSE WORKER";cap="How many barrels?"}
 else {who="NARRATOR";cap="Nearly ten thousand barrels. More than C$18 million vanished."}
 return <AbsoluteFill style={{color:"#fff7e7",fontFamily:"Arial,sans-serif",pointerEvents:"none"}}>
  <div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(0,0,0,.70),transparent 35%),linear-gradient(90deg,rgba(0,0,0,.22),transparent 65%)"}}/>
  <div style={{position:"absolute",left:52,top:38,fontSize:17,fontWeight:800,letterSpacing:3,color:"#e2b679"}}>THE GREAT MAPLE SYRUP HEIST <span style={{color:"#fff",opacity:.5}}> / ORIGINAL</span></div>
  <div style={{position:"absolute",right:52,top:42,fontSize:17,letterSpacing:2}}>QUEBEC · JULY 2012</div>
  {s>=8.1&&s<13&&<div style={{position:"absolute",right:64,top:144,padding:"12px 19px",background:"rgba(4,18,27,.8)",borderLeft:"4px solid #8fd9e8",fontSize:30,fontWeight:800}}>WATER. NOT SYRUP.</div>}
  {s>=13.2&&<div style={{position:"absolute",left:60,top:153,textShadow:"0 5px 18px #000"}}><div style={{fontSize:23,letterSpacing:4,color:"#ffcf91"}}>THE MISSING RESERVE</div><div style={{fontSize:76,fontWeight:900}}>C$18 MILLION+</div></div>}
  <div style={{position:"absolute",bottom:44,left:50,right:50,textAlign:"center",textShadow:"0 3px 14px #000"}}><div style={{color:"#f2be7b",fontSize:14,fontWeight:850,letterSpacing:3,marginBottom:8}}>{who}</div><div style={{fontSize:26,fontWeight:600}}>{cap}</div></div>
  <div style={{position:"absolute",bottom:0,left:0,width:(frame/480*100)+"%",height:5,background:"#dea85c"}}/>
 </AbsoluteFill>;
}
function Movie(){
 const f=useCurrentFrame(),sec=f/FPS;
 return <AbsoluteFill style={{background:"#061824"}}><Scene/><Overlay frame={f} sec={sec}/>
 {process.env.REACT19_UPGRADE_REGRESSION === "1"
    ? <Audio src={staticFile("regression-reference.m4a")}/>
    : <React.Fragment>
        <Audio src={staticFile("foley.wav")} volume={.38}/>
        <Sequence from={0}><Audio src={staticFile("voices/01_narrator_open.mp3")}/></Sequence>
        <Sequence from={200}><Audio src={staticFile("voices/02_inspector.mp3")}/></Sequence>
        <Sequence from={264}><Audio src={staticFile("voices/03_colleague.mp3")}/></Sequence>
        <Sequence from={317}><Audio src={staticFile("voices/04_narrator_end.mp3")}/></Sequence>
      </React.Fragment>}
 </AbsoluteFill>
}
const Root=()=> <Composition id="MapleHeist20" component={Movie} durationInFrames={480} fps={FPS} width={W} height={H}/>;
registerRoot(Root);
