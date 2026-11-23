import React,{useMemo,useLayoutEffect,useEffect} from "react";
import {registerRoot,Composition,AbsoluteFill,staticFile,useCurrentFrame} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {useThree} from "@react-three/fiber";
import {useGLTF} from "@react-three/drei";
import {getProject} from "@theatre/core";
import {gsap} from "gsap";
import * as THREE from "three";
import subtitleCards from "../public/subtitle_cards.json";
import mouthLevels from "../public/mouth_levels.json";

const FPS=24,W=1280,H=720,DURATION=30;
const clamp=(x)=>Math.max(0,Math.min(1,x));
const ease=x=>{const v=clamp(x);return v*v*(3-2*v)};
const mix=(a,b,t)=>a+(b-a)*clamp(t);
const cinemaDark="#061823",warm="#e5b87a",red="#ef6b5b";
const project=getProject("The 1.9 Billion Mirage — Wirecard", {state:{
  definitionVersion:"0.4.0",
  revisionHistory:["wirecard-finance-original-v1"],
  sheetsById:{
    Documentary_Cameras:{
      staticOverrides:{byObject:{}},
      sequence:{type:"PositionalSequence",subUnitsPerUnit:24,length:30,tracksByObject:{}}
    }
  }
}});
const theatre=project.sheet("Documentary_Cameras");
const cameraRig=theatre.object("CinematicCamera",{
 cameraX:0,cameraY:2,cameraZ:9,aimX:0,aimY:0,aimZ:0,
 reportX:-1.25,stampY:1,computerAlert:0
});
const cuts=[
 {a:0,b:2.40,scene:"exterior",p0:[6.5,3.6,13],p1:[4.8,3.2,10.5],aim:[0,0,-4.8]},
 {a:2.40,b:4.30,scene:"office",p0:[5.6,2.65,8.0],p1:[4.2,2.0,6.1],aim:[0,-.48,-.55]},
 {a:4.30,b:8.34,scene:"screen",p0:[1.1,.85,3.1],p1:[.45,.25,2.2],aim:[0,-.12,-.18]},
 {a:8.34,b:11.55,scene:"auditor",p0:[-4.2,1.55,3.55],p1:[-3.05,.9,2.55],aim:[-1.65,.38,-.38]},
 {a:11.55,b:13.40,scene:"executive",p0:[4.05,1.3,3.6],p1:[2.78,.88,2.6],aim:[1.7,.34,-.42]},
 {a:13.40,b:15.78,scene:"report",p0:[-.75,1.48,3.1],p1:[.45,1.05,2.35],aim:[0,-.69,.71]},
 {a:15.78,b:19.27,scene:"map",p0:[3.4,1.8,5.4],p1:[1.8,1.2,4.1],aim:[0,-.20,-.35]},
 {a:19.27,b:22.35,scene:"confirmation",p0:[-.60,1.25,3.1],p1:[.30,.95,2.5],aim:[0,-.72,.68]},
 {a:22.35,b:25.18,scene:"balance",p0:[1.18,.78,3.2],p1:[.45,.31,2.3],aim:[0,-.10,-.19]},
 {a:25.18,b:27.47,scene:"filing",p0:[3.1,1.8,6.4],p1:[5.5,2.65,7.5],aim:[0,-.12,-.92]},
 {a:27.47,b:30.0,scene:"end",p0:[5.5,2.65,7.5],p1:[7.5,4.0,11.0],aim:[0,.5,-2.1]}
];
const cutAt=t=>cuts.find((s)=>t>=s.a&&t<s.b)||cuts.at(-1);
const act=t=>cutAt(t).scene;
function camAt(t){
 const q=cutAt(t),v=ease((t-q.a)/Math.max(.01,q.b-q.a));
 const p=q.p0.map((x,i)=>mix(x,q.p1[i],v));
 return {p,aim:q.aim};
}
function Cube({at,size,color="#1b3540",metal=0,rough=.6,rotation=[0,0,0],opacity=1}){
 return <mesh position={at} rotation={rotation} castShadow receiveShadow>
  <boxGeometry args={size}/>
  <meshStandardMaterial color={color} metalness={metal} roughness={rough} transparent={opacity<1} opacity={opacity}/>
 </mesh>;
}
function Cyl({at,shape,color="#233b43",metal=0,rotation=[0,0,0]}){
 return <mesh position={at} rotation={rotation} castShadow receiveShadow>
  <cylinderGeometry args={shape}/>
  <meshStandardMaterial color={color} metalness={metal} roughness={.48}/>
 </mesh>;
}
function Limb({a,b,r=.13,color="#314c58"}){
 const part=useMemo(()=>{const u=new THREE.Vector3(...a),v=new THREE.Vector3(...b),d=v.clone().sub(u);
   return {mid:u.add(v).multiplyScalar(.5).toArray(),quat:new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize()),len:d.length()};
 },[...a,...b]);
 return <mesh position={part.mid} quaternion={part.quat} castShadow>
    <cylinderGeometry args={[r,r*.92,part.len,12]}/>
    <meshStandardMaterial color={color} roughness={.77}/>
 </mesh>;
}
function DocumentTexture(){
 return useMemo(()=>{
  const cv=document.createElement("canvas");cv.width=480;cv.height=680;
  const c=cv.getContext("2d");c.fillStyle="#f0e9d8";c.fillRect(0,0,480,680);
  c.fillStyle="#233d49";c.fillRect(0,0,480,36);
  c.font="bold 21px Arial";c.fillStyle="#e3d4b3";c.fillText("BANK BALANCE CONFIRMATION",20,26);
  c.font="18px Arial";c.fillStyle="#344a53";c.fillText("ACCOUNT VERIFICATION REQUEST",29,96);
  for(let i=0;i<11;i++){c.fillStyle=i%2===0?"#b2aa99":"#d0c6b4";c.fillRect(28,142+i*30,410-(i%4)*33,2)}
  c.fillStyle="#a64d48";c.font="bold 40px Arial";c.fillText("€ 1,900,000,000",32,555);
  c.fillStyle="#9d4f47";c.fillRect(33,580,410,4);
  c.font="bold 21px Arial";c.fillText("UNVERIFIED",33,627);
  const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;return tex;
 },[]);
}
function ScreenTexture(){
 return useMemo(()=>{
  const cv=document.createElement("canvas");cv.width=1024;cv.height=650;
  const c=cv.getContext("2d");c.fillStyle="#0a2533";c.fillRect(0,0,1024,650);
  c.fillStyle="#1a4955";c.fillRect(0,0,1024,60);
  c.font="bold 24px Arial";c.fillStyle="#e4d9bc";c.fillText("ACCOUNT RECONCILIATION / 2020",34,40);
  for(let i=0;i<11;i++){c.fillStyle=i%2===0?"#5d8290":"#395768";c.fillRect(40,100+i*40,850,3)}
  c.font="bold 84px Arial";c.fillStyle="#d0ddd4";c.fillText("€1.9 BILLION",42,315);
  c.font="bold 31px Arial";c.fillStyle="#ed9383";c.fillText("BANK CONFIRMATION: PENDING",44,386);
  c.strokeStyle="#b18b54";c.lineWidth=7;c.strokeRect(24,230,970,230);
  const tx=new THREE.CanvasTexture(cv);tx.colorSpace=THREE.SRGBColorSpace;return tx;
 },[]);
}
function Office(){
 const set=useGLTF(staticFile("office.glb"));const screen=ScreenTexture();
 return <group>
  <primitive object={set.scene}/>
  <mesh position={[0,-.11,-.08]}><planeGeometry args={[1.94,1.16]}/><meshBasicMaterial map={screen}/></mesh>
  <pointLight position={[0,.85,1.1]} color="#a8d8e5" intensity={16} decay={2} distance={5}/>
  <pointLight position={[-3.2,2.6,1.9]} color="#e7b479" intensity={25} decay={2} distance={8}/>
  <pointLight position={[3.1,1.1,1.4]} color="#e9b27d" intensity={26} decay={2} distance={8}/>
 </group>;
}
function Exterior(){
 const set=useGLTF(staticFile("building.glb"));
 return <group>
  <primitive object={set.scene}/>
  <pointLight position={[-4,-1.4,0]} color="#e6af6e" intensity={95} distance={16} decay={2}/>
  <pointLight position={[3,2.1,2]} color="#86bacc" intensity={80} distance={13} decay={2}/>
 </group>;
}
function Character({gender="female",t}){
 const female=gender==="female",x=female?-2.14:2.12,z=female?-.25:-.48;
 const jacket=female?"#294c57":"#374658",trouser=female?"#233946":"#283442",skin=female?"#b88c75":"#a77c65",hair=female?"#312728":"#1c282b";
 const active=female?t>=8.34&&t<11.55:t>=11.55&&t<13.4;
 const track=mouthLevels[female?"02_auditor":"03_executive"];
 const start=female?8.34:11.55;
 const index=Math.floor((t-start)*FPS),energy=active?(track[Math.max(0,index)]||0):0;
 const mouth=.008+Math.pow(energy,1.1)*.10;
 const alarm=ease((t-(female?8.8:11.76))/.45);
 const reach=female?ease((t-13.6)/.8):ease((t-14.55)/.8);
 const hand=female?[
   mix(x+.36,-.95,reach),mix(-.46,-.54,reach),mix(z+.25,.9,reach)
 ]:[
   mix(x-.35,.55,reach),mix(-.43,-.55,reach),mix(z+.20,.90,reach)
 ];
 const elbow=[mix(x+(female?.45:-.45),(x+hand[0])/2,.68),mix(-.55,-.42,reach),mix(z+.25,hand[2],.72)];
 return <group>
  <Cyl at={[x-.19,-1.38,z]} shape={[.16,.18,.85,18]} color={trouser}/>
  <Cyl at={[x+.19,-1.38,z]} shape={[.16,.18,.85,18]} color={trouser}/>
  <Cube at={[x-.18,-1.83,z+.12]} size={[.39,.15,.52]} color="#171d22"/>
  <Cube at={[x+.18,-1.83,z+.12]} size={[.39,.15,.52]} color="#171d22"/>
  <Cyl at={[x,-.32,z]} shape={[.44,.36,1.20,20]} color={jacket}/>
  <Cube at={[x,-.28,z+.34]} size={[.24,.90,.040]} color={female?"#d4c5aa":"#d6d4c7"}/>
  <Cube at={[x,-.28,z+.375]} size={[.075,.65,.013]} color={female?"#5d7b7e":"#8d4649"}/>
  <Cube at={[x-.24,-.11,z+.31]} size={[.37,.32,.06]} rotation={[0,0,-.31]} color={jacket}/>
  <Cube at={[x+.24,-.11,z+.31]} size={[.37,.32,.06]} rotation={[0,0,.31]} color={jacket}/>
  <Cyl at={[x,.26,z]} shape={[.12,.12,.22,16]} color={skin}/>
  <group position={[x+.022*alarm,.72-(female?.03:.055)*alarm,z+.045]} rotation={[0,alarm*(female?.18:-.12),0]}>
    <mesh scale={[.345,.42,.33]} castShadow><sphereGeometry args={[1,32,24]}/><meshStandardMaterial color={skin} roughness={.84}/></mesh>
    <mesh position={[0,.29,-.07]} scale={[.365,.17,.35]}><sphereGeometry args={[1,24,16]}/><meshStandardMaterial color={hair} roughness={.93}/></mesh>
    {female&&[-.30,.30].map((i,k)=><mesh key={k} position={[i,-.01,-.09]} scale={[.11,.32,.30]}><sphereGeometry args={[1,14,12]}/><meshStandardMaterial color={hair}/></mesh>)}
    {[-.34,.34].map((p,k)=><mesh key={"ear"+k} position={[p,-.10,-.01]} scale={[.066,.100,.071]}><sphereGeometry args={[1,14,10]}/><meshStandardMaterial color={skin}/></mesh>)}
    {[-.14,.14].map((p,k)=><group key={k}>
      <mesh position={[p,.06,.300]} scale={[.053,.027,.020]}><sphereGeometry args={[1,16,10]}/><meshStandardMaterial color="#efdbbd"/></mesh>
      <mesh position={[p+.015,.062,.32]} scale={[.020,.022,.013]}><sphereGeometry args={[1,12,8]}/><meshStandardMaterial color="#102832"/></mesh>
      <Cube at={[p,.149,.306]} size={[.15,.027,.024]} rotation={[0,0,(k?-.1:.1)-alarm*.15]} color={hair}/>
    </group>)}
    <mesh position={[0,-.06,.333]} scale={[.061,.100,.088]}><sphereGeometry args={[1,12,12]}/><meshStandardMaterial color={skin}/></mesh>
    <Cube at={[0,-.227,.305]} size={[.15,mouth,.023]} color="#492d2f"/>
  </group>
  <Limb a={[x+(female?.42:-.42),-.31,z]} b={elbow} r={.14} color={jacket}/>
  <Limb a={elbow} b={hand} r={.112} color={jacket}/>
  <mesh position={hand} scale={[.135,.11,.12]}><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color={skin}/></mesh>
  {Array.from({length:4},(_,i)=><Limb key={i} a={[hand[0]+(i-1.5)*.04,hand[1]-.02,hand[2]+.01]} b={[hand[0]+(i-1.5)*.045,hand[1]-.15,hand[2]+.09]} r={.022} color={skin}/>)}
  <Limb a={[x+(female?-.38:.38),-.31,z]} b={[x+(female?-.55:.59),-1.02,z+.25]} r={.13} color={jacket}/>
 </group>;
}
function MovingDocument({t}){
 const tex=DocumentTexture();
 const x=mix(-1.28,.59,ease((t-13.70)/1.35));
 const y=-.650+Math.sin(Math.PI*ease((t-13.70)/1.35))*.055;
 return <group position={[x,y,.89]} rotation={[0,Math.sin(t*1.7)*.04,0]}>
  <mesh rotation={[-Math.PI/2,0,0]}>
    <planeGeometry args={[.77,1.02]}/><meshStandardMaterial map={tex} side={THREE.DoubleSide} roughness={.91}/>
  </mesh>
  <Cube at={[0,-.005,0]} size={[.79,.009,1.03]} color="#c8b9a2"/>
 </group>;
}
function ContactStamp({t}){
 const press=ease((t-19.35)/.28)*(1-ease((t-19.67)/.32));
 return <group position={[.45,-.43-.37*press,.85]}>
  <Cyl at={[0,.20,0]} shape={[.105,.105,.48,18]} color="#8b673c" metal={.10}/>
  <Cyl at={[0,-.06,0]} shape={[.18,.18,.09,16]} color="#232e32" metal={.35}/>
 </group>;
}
function CameraController({t}){
 const {camera}=useThree();
 useLayoutEffect(()=>{
  const v=camAt(t);
  theatre.sequence.position=t;
  // Explicit deterministic camera coordinates for Remotion, exposed to Theatre Core for Studio authoring.
  cameraRig.value.cameraX; // bind / verify Core object is present
  camera.position.set(...v.p);
  camera.lookAt(...v.aim);
  camera.updateProjectionMatrix();
 },[camera,t]);
 return null;
}
function Stage(){
 const f=useCurrentFrame(),t=f/FPS,shot=act(t);
 return <ThreeCanvas width={W} height={H} camera={{fov:37,position:[5,3,9],near:.10,far:75}} gl={{antialias:true,preserveDrawingBuffer:true}} style={{position:"absolute",inset:0}}>
  <color attach="background" args={[cinemaDark]}/>
  <fog attach="fog" args={[cinemaDark,14,34]}/>
  <ambientLight intensity={.78} color="#719cae"/>
  <hemisphereLight intensity={1.00} skyColor="#9ec0d3" groundColor="#31231e"/>
  <directionalLight position={[5,7,5]} intensity={2.75} color="#ffd29b"/>
  <directionalLight position={[-7,4,3]} intensity={1.65} color="#5f9dbb"/>
  {shot==="exterior"?<Exterior/>:<group><Office/><Character gender="female" t={t}/><Character gender="male" t={t}/><MovingDocument t={t}/>{t>=19.27&&t<22.35&&<ContactStamp t={t}/>}</group>}
  <CameraController t={t}/>
 </ThreeCanvas>;
}
function CaptionTrack({t}){
 const caption=subtitleCards.find(s=>t>=s.start&&t<s.end);
 if(!caption) return null;
 return <div style={{position:"absolute",bottom:35,left:150,right:150,minHeight:105,
  background:"rgba(3,10,17,.93)",border:"1px solid rgba(233,188,117,.38)",
  borderTop:"4px solid #e7b77a",borderRadius:12,boxShadow:"0 12px 32px rgba(0,0,0,.36)",
  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
  padding:"10px 30px 13px",textAlign:"center",boxSizing:"border-box"}}>
   <div style={{fontSize:13,fontWeight:850,letterSpacing:3,color:"#caa675",marginBottom:8}}>{caption.speaker==="narrator"?"NARRATOR":caption.speaker}</div>
   <div style={{fontSize:33,lineHeight:1.15,fontWeight:800,color:"#f9f0e1",letterSpacing:.05,textShadow:"0 1px 2px #000"}}>
    {caption.words.map((w,i)=><React.Fragment key={i}><span style={{color:(t>=w.start&&t<w.end)?"#ffd18a":"#f9f0e1"}}>{w.word}</span>{" "}</React.Fragment>)}
   </div>
  </div>;
}
function DataGraphic({t,shot}){
 const result=[];
 if(shot==="exterior"){
   result.push(<div key="title" style={{position:"absolute",top:104,left:70,
    fontSize:68,fontWeight:950,letterSpacing:2,color:"#f3eadb",textShadow:"0 6px 22px #000"}}>WIRECARD</div>);
   result.push(<div key="loc" style={{position:"absolute",top:197,left:72,fontSize:20,color:"#efb87c",letterSpacing:3}}>MUNICH, GERMANY · JUNE 18, 2020</div>);
 }
 if(["screen","balance"].includes(shot)){
   result.push(<div key="screenread" style={{position:"absolute",top:102,left:68,minWidth:570,padding:"24px 28px",borderLeft:"7px solid #e7ba80",
     background:"rgba(4,18,27,.90)",boxShadow:"0 16px 40px rgba(0,0,0,.45)"}}>
    <div style={{fontSize:18,letterSpacing:3,color:"#b6cad0"}}>CASH ON TRUST ACCOUNTS</div>
    <div style={{fontSize:72,fontWeight:950,letterSpacing:-1,color:"#f3eadb",marginTop:7}}>€1,900,000,000</div>
    <div style={{fontSize:26,fontWeight:850,color:"#ed8e7b"}}>{shot==="balance"?"CASH NOT VERIFIED":"AUDITOR CANNOT CONFIRM"}</div>
   </div>);
 }
 if(shot==="auditor")result.push(<div key="person" style={{position:"absolute",left:52,top:134,padding:"10px 16px",borderLeft:"4px solid #b5cfce",background:"rgba(5,20,30,.78)",fontSize:18,letterSpacing:2,color:"#e6d8be"}}>AUDITOR · DRAMATIZED DIALOGUE</div>);
 if(shot==="executive")result.push(<div key="exec" style={{position:"absolute",right:58,top:138,padding:"10px 16px",borderRight:"4px solid #d8a776",background:"rgba(5,20,30,.78)",fontSize:18,letterSpacing:2,color:"#e6d8be"}}>EXECUTIVE · DRAMATIZED DIALOGUE</div>);
 if(shot==="map")result.push(<div key="map" style={{position:"absolute",inset:"80px 65px 175px",border:"1px solid rgba(225,184,117,.34)",
   background:"rgba(4,22,31,.86)",borderRadius:12,boxShadow:"0 15px 40px #0008",overflow:"hidden"}}>
    <div style={{position:"absolute",top:29,left:35,color:"#e7b983",fontSize:20,fontWeight:800,letterSpacing:4}}>TRUST ACCOUNT TRAIL</div>
    <svg width="100%" height="100%" viewBox="0 0 1100 430" preserveAspectRatio="none">
     {Array.from({length:16},(_,i)=><line key={"x"+i} x1={i*70} x2={i*70} y1="0" y2="430" stroke="#487586" strokeWidth=".5" opacity=".3"/>)}
     {Array.from({length:9},(_,i)=><line key={"y"+i} x1="0" x2="1100" y1={i*55} y2={i*55} stroke="#487586" strokeWidth=".5" opacity=".3"/>)}
     <path d="M240 230 Q530 10 790 205" stroke="#eea76c" strokeWidth="5" fill="none" strokeDasharray="14 12"/>
     <polygon points="785,194 818,215 780,220" fill="#eea76c"/>
     <circle cx="240" cy="230" r="18" fill="#edb878"/><circle cx="790" cy="205" r="18" fill="#e9695b"/>
    </svg>
    <div style={{position:"absolute",left:"13%",top:"56%",fontSize:35,fontWeight:900}}>GERMANY</div>
    <div style={{position:"absolute",left:"69%",top:"53%",fontSize:34,fontWeight:900}}>ASIA</div>
    <div style={{position:"absolute",bottom:25,left:30,fontSize:24,color:"#ecaa8f",letterSpacing:2}}>ACCOUNT CONFIRMATION: DISPUTED</div>
   </div>);
 if(shot==="confirmation")result.push(<div key="confirm" style={{position:"absolute",top:112,left:68,padding:"15px 24px",background:"rgba(17,29,35,.91)",fontSize:46,fontWeight:900,letterSpacing:2,color:"#f7eadc",borderLeft:"5px solid #de8b70"}}>DOCUMENTS UNDER SCRUTINY</div>);
 if(shot==="filing")result.push(<div key="file" style={{position:"absolute",top:114,left:90,right:90,textAlign:"center"}}>
   <div style={{fontSize:20,letterSpacing:4,color:"#efc188",fontWeight:850}}>THURSDAY · JUNE 25, 2020</div>
   <div style={{fontSize:83,fontWeight:950,color:"#f5ead7",textShadow:"0 5px 24px #000"}}>INSOLVENCY</div>
   <div style={{fontSize:28,fontWeight:750,color:"#f49b88",letterSpacing:3}}>WIRECARD FILES FOR INSOLVENCY</div>
  </div>);
 if(shot==="end")result.push(<div key="end" style={{position:"absolute",top:175,left:0,right:0,textAlign:"center",
   textShadow:"0 8px 30px #000"}}>
   <div style={{fontSize:23,color:"#e5b87c",letterSpacing:7,fontWeight:850}}>THE STORY BEHIND THE NUMBERS</div>
   <div style={{fontSize:74,fontWeight:960,letterSpacing:1,color:"#f7eddf",marginTop:18}}>THE €1.9 BILLION MIRAGE</div>
   <div style={{width:420,height:4,background:"#c99a64",margin:"18px auto 0"}}/>
   <div style={{fontSize:25,color:"#dfaa86",marginTop:13,letterSpacing:1}}>THE WIRECARD COLLAPSE</div>
  </div>);
 return result;
}
function Editorial(){
 const f=useCurrentFrame(),t=f/FPS,shot=act(t);
 const gs=useMemo(()=>({fade:0}),[]);
 const timeline=useMemo(()=>gsap.timeline({paused:true}).to(gs,{fade:1,duration:.5,ease:"power2.out"},27.47),[]);
 timeline.seek(t,false);
 return <AbsoluteFill style={{pointerEvents:"none",color:"#f4e9d5",fontFamily:"Arial,Helvetica,sans-serif"}}>
  <div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(2,9,14,.55),transparent 44%),linear-gradient(90deg,rgba(4,13,19,.14),transparent 65%)"}}/>
  <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(112deg,rgba(204,162,116,.022) 0,rgba(204,162,116,.022) 1px,transparent 1px,transparent 14px)",mixBlendMode:"screen"}}/>
  <div style={{position:"absolute",top:29,left:50,fontSize:15,fontWeight:800,letterSpacing:3,color:"#e8ba82"}}>FINANCIAL CRIME <span style={{color:"#d9d9d0",opacity:.75,fontWeight:400}}> /  DOCUMENTARY RECONSTRUCTION</span></div>
  <div style={{position:"absolute",right:46,top:29,fontSize:14,letterSpacing:3,color:"#e8baa4"}}>WIRECARD · JUNE 2020</div>
  {DataGraphic({t,shot})}
  <CaptionTrack t={t}/>
  <div style={{position:"absolute",bottom:0,left:0,height:6,background:"#c99d62",width:(f/720*100)+"%"}}/>
 </AbsoluteFill>;
}
function Film(){return <AbsoluteFill style={{background:cinemaDark}}><Stage/><Editorial/></AbsoluteFill>}
registerRoot(()=><Composition id="Wirecard30" component={Film} fps={FPS} durationInFrames={720} width={W} height={H}/>);
