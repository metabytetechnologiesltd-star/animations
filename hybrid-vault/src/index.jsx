import React,{useMemo,useLayoutEffect,useEffect} from "react";
import {registerRoot,Composition,AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {useThree} from "@react-three/fiber";
import {useGLTF} from "@react-three/drei";
import {Bloom,EffectComposer,Vignette} from "@react-three/postprocessing";
import {gsap} from "gsap";
import * as THREE from "three";
import {sheet,director,baselineAt} from "./theatre-state";

const FPS=24,SECONDS=21,W=1280,H=720;
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{let t=clamp(x);return t*t*(3-2*t)};
const lerp=(a,b,t)=>a+(b-a)*clamp(t);
function Box({p,s,color="#344b53",metalness=.12,roughness=.58,rotation=[0,0,0],opacity=1}){
 return <mesh position={p} rotation={rotation} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={color} metalness={metalness} roughness={roughness} transparent={opacity<1} opacity={opacity}/></mesh>;
}
function Cy({p,a,color,rot=[0,0,0],metalness=.1,opacity=1}){
 return <mesh position={p} rotation={rot} castShadow receiveShadow><cylinderGeometry args={a}/><meshStandardMaterial color={color} roughness={.55} metalness={metalness} transparent={opacity<1} opacity={opacity}/></mesh>;
}
function Limb({a,b,r=.1,color="#344b53"}){
 const q=useMemo(()=>{let u=new THREE.Vector3(...a),v=new THREE.Vector3(...b),d=v.clone().sub(u);return {mid:u.add(v).multiplyScalar(.5).toArray(),len:d.length(),rot:new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize())}},[...a,...b]);
 return <mesh position={q.mid} quaternion={q.rot} castShadow><cylinderGeometry args={[r,r*.85,q.len,12]}/><meshStandardMaterial color={color} roughness={.8}/></mesh>;
}
function PaintedWall(){
 const texture=useMemo(()=>{
  const cv=document.createElement("canvas");cv.width=cv.height=512;
  const ctx=cv.getContext("2d");ctx.fillStyle="#182e38";ctx.fillRect(0,0,512,512);
  let seed=62353;const rand=()=>{seed=(seed*48271)%2147483647;return seed/2147483647};
  for(let i=0;i<1400;i++){let x=rand()*512,y=rand()*512,w=3+rand()*38;
   ctx.strokeStyle=(i%4===0?"rgba(232,174,112,.17)":"rgba(1,15,24,.19)");ctx.lineWidth=.5+rand()*2;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w,y-w*.34);ctx.stroke();
  }
  const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(4,2);return t;
 },[]);
 return <mesh position={[0,1.15,-8]} receiveShadow><planeGeometry args={[34,14]}/><meshStandardMaterial map={texture} roughness={.9}/></mesh>;
}
function Architecture(){
 return <group>
  <PaintedWall/>
  <Box p={[0,-2.05,-2]} s={[25,.24,24]} color="#172f39" roughness={.4}/>
  {Array.from({length:11},(_,i)=><Box key={"f"+i} p={[-6+i*1.22,-1.91,-2]} s={[.016,.007,22]} color="#775f43" metalness={.5}/>)}
  {Array.from({length:9},(_,i)=><Box key={"g"+i} p={[0,-1.91,-8+i*1.45]} s={[17,.007,.019]} color="#70583f" metalness={.55}/>)}
  {[-5.3,-3.2,3.2,5.3].map((x,i)=><group key={i}>
   <Cy p={[x,.5,-5.7]} a={[.35,.43,5.2,10]} color="#263e45"/>
   <Cy p={[x,3.0,-5.7]} a={[.53,.54,.28,10]} color="#956c48" metalness={.5}/>
   <Box p={[x,1.5,-5.31]} s={[.04,3.4,.035]} color="#b18e61" metalness={.5}/>
  </group>)}
  <Box p={[0,3.35,-5.4]} s={[11,.2,.4]} color="#836c51" metalness={.6}/>
  <Box p={[0,-1.87,-3.2]} s={[4.6,.17,1.6]} color="#8c775e" metalness={.4}/>
  {[-4,4].map((x,i)=><pointLight key={i} position={[x,2.2,-3.4]} intensity={19} distance={8} color="#e7ac70" decay={2}/>)}
 </group>;
}
function Exhibit(){
 const art=useGLTF(staticFile("vault_display.glb"));
 return <group>
   <primitive object={art.scene} position={[0,-.85,-5.15]} scale={.83}/>
   <Box p={[0,.98,-5.13]} s={[1.54,.055,1.22]} color="#b8a684" metalness={.55} roughness={.2}/>
   {[-.77,.77].flatMap(x=>[-.59,.59].map(z=><Cy key={String(x)+String(z)} p={[x,.18,-5.13+z]} a={[.028,.028,1.62,12]} color="#bb9971" metalness={.7}/>))}
   <Box p={[0,-.25,-4.5]} s={[1.56,1.42,.035]} color="#47798b" metalness={.17} opacity={.7}/>
   <pointLight position={[0,2.15,-5.1]} intensity={18} distance={5} color="#f0c999" decay={2}/>
 </group>;
}
function Door({time}){
 const data=baselineAt(time);
 const turn=data.wheelTurn,open=data.doorOpen;
 return <group>
  <Cy p={[0,.05,-3.5]} a={[1.73,1.73,.18,12]} rot={[Math.PI/2,0,0]} color="#8e8676" metalness={.82}/>
  <Cy p={[0,.05,-3.33]} a={[1.51,1.51,.11,12]} rot={[Math.PI/2,0,0]} color="#0a1c25" metalness={.75}/>
  {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <Cy key={i} p={[1.64*Math.cos(a),.05+1.64*Math.sin(a),-3.29]} a={[.06,.06,.1,8]} rot={[Math.PI/2,0,0]} color="#d7ad72" metalness={.88}/>})}
  <group position={[-1.46,.05,-3.17]} rotation={[0,-open,0]}>
   <group position={[1.46,0,0]}>
    <Cy p={[0,0,.05]} a={[1.42,1.42,.23,12]} rot={[Math.PI/2,0,0]} color="#344a56" metalness={.75}/>
    <Cy p={[0,0,.21]} a={[1.24,1.24,.065,12]} rot={[Math.PI/2,0,0]} color="#1a333d" metalness={.62}/>
    {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <Cy key={i} p={[1.16*Math.cos(a),1.16*Math.sin(a),.26]} a={[.044,.044,.13,8]} rot={[Math.PI/2,0,0]} color="#d3b482" metalness={.78}/>})}
    <group position={[0,0,.36]} rotation={[0,0,turn]}>
      <mesh><torusGeometry args={[.48,.055,10,32]}/><meshStandardMaterial color="#d2a86a" metalness={.84} roughness={.23}/></mesh>
      {Array.from({length:5},(_,i)=><Box key={i} p={[0,0,0]} s={[.07,.93,.13]} rotation={[0,0,i*Math.PI/5]} color="#c7a06e" metalness={.74}/>)}
      <Cy p={[0,0,.11]} a={[.22,.22,.16,12]} rot={[Math.PI/2,0,0]} color="#d2b283" metalness={.9}/>
    </group>
    <Box p={[.96,-.45,.29]} s={[.18,.25,.13]} color="#bd5242"/>
    <Box p={[1.02,-.45,.37]} s={[.12,.09,.027]} color="#e1ba90" metalness={.3}/>
   </group>
  </group>
 </group>;
}
function Human({x,z=-.8,guard=false,time}){
 const dat=baselineAt(time),reach=guard?dat.touch:dat.point;
 const color=guard?"#263947":"#40545b",skin=guard?"#a47a65":"#b47d6a";
 const speaking=guard?(time>10.55&&time<12.75):(time>6.05&&time<10.1);
 const mouth=speaking?(0.02+0.045*Math.abs(Math.sin(time*19))):0.01;
 const elbow=[lerp(x+(guard?-.35:.35),guard?1.0:-.74,reach),lerp(-.65,-.50,reach),lerp(z+.05,-1.48,reach)];
 const hand=[lerp(x+(guard?-.65:.66),guard?.43:-.42,reach),lerp(-1.13,guard?.20:-.50,reach),lerp(z+.35,guard?-2.68:-3.04,reach)];
 return <group>
  <Cy p={[x,-1.22,z]} a={[.32,.33,1.27,12]} color={guard?"#1b2933":"#283339"}/>
  <Cy p={[x,-.42,z]} a={[.43,.34,1.2,16]} color={color}/>
  <Box p={[x,-.35,z+.36]} s={[.28,.99,.039]} color={guard?"#ad856d":"#bda084"}/>
  <Box p={[x-.23,-.12,z+.32]} s={[.33,.44,.08]} rotation={[0,0,-.33]} color={guard?"#394957":"#53666b"}/>
  <Box p={[x+.23,-.12,z+.32]} s={[.33,.44,.08]} rotation={[0,0,.33]} color={guard?"#394957":"#53666b"}/>
  <Cy p={[x,.24,z]} a={[.14,.13,.2,12]} color={skin}/>
  <group position={[x,.72-ease((time-7.9)/1.1)*.08,z+.05]} rotation={[0,(guard?-.12:.16)*ease((time-9)/.5),0]}>
   <mesh scale={[.36,.44,.33]}><sphereGeometry args={[1,24,18]}/><meshStandardMaterial color={skin} flatShading roughness={.85}/></mesh>
   <mesh position={[0,.27,-.05]} scale={[.37,.20,.36]}><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color="#1f252a" roughness={.91}/></mesh>
   {Array.from({length:5},(_,i)=><mesh key={i} position={[(i-2)*.14,.36,.13]} rotation={[.23,0,(i-2)*.14]} scale={[.14,.22,.13]}><coneGeometry args={[1,1,6]}/><meshStandardMaterial color="#171e25"/></mesh>)}
   {[-.14,.14].map((v,i)=><group key={i}>
     <mesh position={[v,.065,.306]} scale={[.061,.036,.017]}><sphereGeometry args={[1,12,8]}/><meshStandardMaterial color="#d7d0b5"/></mesh>
     <mesh position={[v+.018,.07,.32]} scale={[.028,.027,.016]}><sphereGeometry args={[1,10,8]}/><meshStandardMaterial color="#0b1821"/></mesh>
     <Box p={[v,.167,.31]} s={[.18,.031,.024]} color="#28212a" rotation={[0,0,guard?.07:-.1]}/>
   </group>)}
   <mesh position={[0,-.048,.335]} scale={[.085,.115,.13]}><coneGeometry args={[1,1,5]}/><meshStandardMaterial color={skin}/></mesh>
   <Box p={[0,-.215,.32]} s={[.14,mouth,.02]} color="#492c2b"/>
  </group>
  <Limb a={[x+(guard?-.36:.36),-.26,z]} b={elbow} color={color} r={.145}/>
  <Limb a={elbow} b={hand} color={color} r={.11}/>
  <mesh position={hand} scale={[.16,.13,.14]}><sphereGeometry args={[1,16,12]}/><meshStandardMaterial color={skin}/></mesh>
  {Array.from({length:4},(_,i)=><Limb key={i} a={[hand[0]+(i-1.5)*.052,hand[1]-.04,hand[2]+.02]} b={[hand[0]+(i-1.5)*.056,hand[1]-.17,hand[2]+.11]} color={skin} r={.027}/>)}
  <Limb a={[x+(guard?.36:-.36),-.22,z]} b={[x+(guard?.52:-.52),-1.24,z+.30]} color={color} r={.14}/>
  {guard&&<pointLight position={[x+.52,-1.1,z+.45]} color="#c1dbf0" distance={4} intensity={11} decay={2}/>}
 </group>;
}
function Reflection({time}){
 const opacity=ease((time-15.55)/1.45)*.75;
 if(opacity===0)return null;
 return <group position={[0,.20,-4.48]}>
  <mesh position={[0,.72,.015]} scale={[.38,.42,.07]}><sphereGeometry args={[1,16,12]}/><meshBasicMaterial color="#091b24" transparent opacity={opacity}/></mesh>
  <mesh position={[0,-.43,0]} scale={[.57,.90,.08]}><capsuleGeometry args={[.62,.50,4,8]}/><meshBasicMaterial color="#06151e" transparent opacity={opacity}/></mesh>
  {[-1,1].map(s=><Cy key={s} p={[s*.47,-.44,.02]} a={[.11,.13,1.15,9]} rot={[0,0,s*.18]} color="#0a2430" opacity={opacity}/>)}
  <pointLight position={[0,.75,.8]} color="#67cee2" intensity={opacity*9} decay={2} distance={3}/>
 </group>;
}
function Camera({time}){
 const {camera}=useThree();
 useLayoutEffect(()=>{
  sheet.sequence.position=time;const p=director.value || baselineAt(time);
  camera.position.set(p.camX,p.camY,p.camZ);camera.lookAt(p.aimX,p.aimY,p.aimZ);camera.updateProjectionMatrix();
 },[time,camera]);
 return null;
}
function Scene(){
 const time=useCurrentFrame()/FPS;
 useEffect(()=>{
  if(typeof window!=="undefined" && window.location.search.includes("theatreStudio=1")){
   import("@theatre/studio").then(m=>m.default.initialize()).catch(e=>console.warn("Studio unavailable",e));
  }
 },[]);
 return <ThreeCanvas width={W} height={H} camera={{fov:38,position:[5,2,8],near:.1,far:65}} gl={{antialias:true,preserveDrawingBuffer:true}} style={{position:"absolute",inset:0}}>
  <color attach="background" args={["#071923"]}/><fog attach="fog" args={["#071923",10,28]}/>
  <ambientLight intensity={.68} color="#77a4b7"/>
  <hemisphereLight intensity={.88} skyColor="#abcede" groundColor="#332a24"/>
  <directionalLight position={[5,7,5]} intensity={2.45} color="#e7b982"/>
  <directionalLight position={[-6,4,3]} intensity={1.75} color="#5cabc6"/>
  <pointLight position={[0,2,-2]} intensity={29} distance={9} decay={2} color="#ffc38d"/>
  <Architecture/><Exhibit/><Door time={time}/>
  <Human x={-2.03} guard={false} time={time}/><Human x={2.03} guard time={time}/>
  <Reflection time={time}/><Camera time={time}/>
  <EffectComposer multisampling={0}><Bloom intensity={.16} luminanceThreshold={1.1}/><Vignette eskil={false} offset={.23} darkness={.36}/></EffectComposer>
 </ThreeCanvas>;
}
function InkOverlay(){
 const t=useCurrentFrame()/FPS;
 const obj=useMemo(()=>({reveal:0,title:0}),[]);
 const timeline=useMemo(()=>gsap.timeline({paused:true}).to(obj,{reveal:1,duration:.6,ease:"power2.out"},15.5).to(obj,{title:1,duration:.8,ease:"power2.out"},17.0),[]);
 timeline.seek(t,false);
 return <AbsoluteFill style={{pointerEvents:"none",fontFamily:"Arial,Helvetica,sans-serif",color:"#f4e3c8"}}>
  <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(106deg,rgba(243,187,127,.025) 0px,rgba(243,187,127,.025) 1px,transparent 1px,transparent 14px)",mixBlendMode:"screen"}}/>
  <div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(0,10,18,.65),transparent 36%)"}}/>
  <div style={{position:"absolute",left:47,top:35,fontSize:16,letterSpacing:3,fontWeight:800,color:"#e4bd85"}}>02:17 AM <span style={{opacity:.65,fontWeight:400}}> / VAULT 06</span></div>
  <div style={{position:"absolute",right:45,top:37,fontSize:14,letterSpacing:3,opacity:.72}}>ORIGINAL HYBRID THRILLER</div>
  {t>6.7&&t<10.6&&<div style={{position:"absolute",left:57,top:128,padding:"10px 18px",background:"rgba(6,17,26,.78)",borderLeft:"5px solid #eb7762",color:"#ffc3a7",fontSize:21,letterSpacing:2}}>SEAL INTACT <span style={{fontSize:12,color:"#f5e9d2",marginLeft:12}}>EXHIBIT EMPTY</span></div>}
  {t>15.5&&<div style={{position:"absolute",left:75,top:160,opacity:obj.reveal,transform:"translateY("+((1-obj.reveal)*30)+"px)",textShadow:"0 6px 24px #000"}}>
    <div style={{fontSize:22,letterSpacing:3,color:"#edac75",fontWeight:850}}>THE CAMERA RECORDED</div>
    <div style={{fontSize:47,fontWeight:900,letterSpacing:2}}>AN IMPOSSIBLE</div>
    <div style={{fontSize:60,fontWeight:900,letterSpacing:1}}>REFLECTION.</div>
  </div>}
  {t>17&&<div style={{position:"absolute",left:67,bottom:112,opacity:obj.title,transform:"translateX("+((1-obj.title)*-35)+"px)",textShadow:"0 6px 25px #000"}}>
    <div style={{width:300,height:4,background:"#e6b47a",marginBottom:16}}/>
    <div style={{fontWeight:900,fontSize:52,letterSpacing:1}}>THE IMPOSSIBLE FRAME</div>
    <div style={{fontSize:14,letterSpacing:4,color:"#ecc49a",marginTop:5}}>AN ORIGINAL ANIMATED CRIME STORY</div>
  </div>}
  <div style={{position:"absolute",left:0,right:0,bottom:0,height:5,background:"#c4945d"}}/>
 </AbsoluteFill>;
}
function Movie(){
 return <AbsoluteFill style={{background:"#071923"}}>
  <Scene/><InkOverlay/>
  <Audio src={staticFile("sound_design.wav")} volume={.53}/>
  <Sequence from={0}><Audio src={staticFile("voices/01_narrator_open.mp3")}/></Sequence>
  <Sequence from={146}><Audio src={staticFile("voices/02_curator.mp3")}/></Sequence>
  <Sequence from={255}><Audio src={staticFile("voices/03_guard.mp3")}/></Sequence>
  <Sequence from={315}><Audio src={staticFile("voices/04_narrator_end.mp3")}/></Sequence>
 </AbsoluteFill>;
}
registerRoot(()=><Composition id="ImpossibleFrame21" component={Movie} fps={FPS} durationInFrames={SECONDS*FPS} width={W} height={H}/>);
