"""Generate original voice-driven caption timing, mouth amplitude data, sound design and audio mixer.
All generated voices are actual ElevenLabs recordings downloaded into public/voices by GitHub Actions.
"""
import json,os,re,subprocess,wave
import numpy as np
from pathlib import Path
ROOT=Path(__file__).parent
PUB=ROOT/"public"
VOICE=PUB/"voices"
SR=24000;FPS=24;DURATION=30.0
SLOTS=[
 ("narrator","01_narrator_open.mp3",0.00,8.32,"June eighteenth, twenty twenty. An auditor at Wirecard asked a simple question. Where was the one point nine billion euros?"),
 ("AUDITOR","02_auditor.mp3",8.34,3.20,"The bank says these confirmations aren't genuine."),
 ("EXECUTIVE","03_executive.mp3",11.55,1.84,"Then where is the money?"),
 ("narrator","04_narrator_middle.mp3",13.40,6.08,"Wirecard said the cash sat in overseas trustee accounts. But the auditors could not verify the balances."),
 ("narrator","05_narrator_end.mp3",19.27,10.72,"Four days later, the company said the money likely never existed. By June twenty-fifth, Wirecard had filed for insolvency. So who invented the cash?")
]
def decode(name):
 out=ROOT/("._"+name.replace(".mp3",".wav"))
 subprocess.run(["ffmpeg","-nostdin","-hide_banner","-loglevel","error","-y","-i",str(VOICE/name),"-ac","1","-ar",str(SR),str(out)],check=True)
 with wave.open(str(out),"rb") as f:
  x=np.frombuffer(f.readframes(f.getnframes()),dtype="<i2").astype(np.float64)/32768.
 out.unlink()
 return x
levels={};all_words=[];subtitles=[];script_info=[]
for role,file,start,dur,text in SLOTS:
 audio=decode(file)
 energies=[]
 for i in range(int(np.ceil(len(audio)/SR*FPS))):
  z=audio[int(i/FPS*SR):int((i+1)/FPS*SR)]
  energies.append(float(np.sqrt(np.mean(z*z))) if len(z) else 0)
 peak=max(np.quantile(energies,.9),.001)
 levels[file.replace(".mp3","")]=[round(float(np.clip(x/peak,0,1)),3) for x in energies]
 words=text.split(" ")
 weights=np.array([max(2.0,len(w.strip(".,!?;:'\""))**.72) for w in words],dtype=float)
 # weighted natural timing; no claims of phoneme-perfect timing until WhisperX audio alignment
 edges=np.concatenate([[0],np.cumsum(weights)/weights.sum()*dur])
 for i,w in enumerate(words):
  all_words.append({"start":round(start+edges[i],3),"end":round(start+edges[i+1],3),"word":w,"speaker":role})
 # subtitle display groups of 3-6 words within max 44 glyphs (lower caption bar)
 i=0
 while i<len(words):
  j=i
  part=[]
  while j<len(words) and (len(part)<6) and (len(" ".join(part+[words[j]]))<46 or not part):
   part.append(words[j]);j+=1
  subtitles.append({"start":round(start+edges[i],3),"end":round(start+edges[j],3),
    "speaker":role,"text":" ".join(part),
    "words":[{"word":words[k],"start":round(start+edges[k],3),"end":round(start+edges[k+1],3)} for k in range(i,j)]})
  i=j
 script_info.append({"speaker":role,"filename":file,"start":start,"duration":dur,"line":text,"audio_duration":round(len(audio)/SR,3)})
with open(PUB/"subtitle_cards.json","w") as f:json.dump(subtitles,f,indent=2)
with open(PUB/"mouth_levels.json","w") as f:json.dump(levels,f)
with open(ROOT/"voice_cue_sheet.json","w") as f:json.dump(script_info,f,indent=2)
def stamp(t):return ("%02d:%02d:%02d,%03d"%(int(t//3600),int(t//60)%60,int(t)%60,round((t%1)*1000)))
with open(ROOT/"captions.srt","w") as f:
 for i,v in enumerate(subtitles):
  f.write("%d\n%s --> %s\n%s\n\n"%(i+1,stamp(v["start"]),stamp(v["end"]),v["text"]))
# Original Foley, soft ambiance and on-contact sound, NO reused effects.
N=int(SR*DURATION);y=np.zeros(N);rng=np.random.default_rng(9231)
def add(t,s,vol):
 k=int(t*SR)
 if k>=N:return
 n=min(len(s),N-k)
 y[k:k+n]+=s[:n]*vol
def impact(t,f=180,vol=.06,dec=.18):
 x=np.arange(int(SR*dec))/SR
 s=(np.sin(2*np.pi*(f*x-90*x*x))*np.exp(-x*26)) + rng.normal(0,.08,len(x))*np.exp(-x*19)
 add(t,s,vol)
def fabric(t,sec=.27,vol=.04,lo=.03):
 x=rng.standard_normal(int(SR*sec))
 smooth=np.cumsum(x);smooth=np.concatenate([[smooth[0]],np.diff(smooth)])
 smooth=np.convolve(smooth,np.ones(61)/61,mode="same")
 env=np.sin(np.pi*np.linspace(0,1,len(smooth)))**2
 add(t,smooth*env,vol)
def keyclick(t):
 impact(t,420,.022,.09);impact(t+.015,130,.011,.08)
for t in [2.23,2.57,2.86,3.09,4.72,4.94,5.08,5.22,5.50]:keyclick(t)
fabric(5.52,.45,.13)
for t in [8.55,9.43,10.9]:fabric(t,.36,.063)
impact(11.80,80,.14,.24)
fabric(13.80,.63,.12)
impact(15.0,200,.060,.11)
fabric(15.11,.62,.11)
impact(19.65,470,.10,.12)   # paper verification stamp
fabric(20.2,.12,.04)
impact(23.06,75,.14,.49)    # missing funds graphic impact
impact(25.24,102,.18,.65)   # insolvency card
# restrained music punctuations and non-mechanical room-air ambiance
for time,f,dur,amp in [(0,93.2,8,.014),(8.3,110,3,.014),(13.4,73.4,7,.020),(19.3,82.4,11,.018),(25.2,61.74,4,.02)]:
 x=np.arange(int(dur*SR))/SR
 s=np.sin(2*np.pi*f*x)*(.6*np.sin(np.pi*np.minimum(1,x/.24)/2)+.4)*np.exp(-x/max(dur,.1)*1.4)
 add(time,s,amp)
air=rng.standard_normal(N)
air=np.convolve(air,np.ones(245)/245,mode="same")
y+=air*.013
fade=min(N,int(.4*SR));y[-fade:]*=np.linspace(1,0,fade)
y=np.tanh(y*1.16)
with wave.open(str(PUB/"foley.wav"),"wb") as f:
 f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR)
 f.writeframes((np.clip(y,-1,1)*32767).astype("<i2").tobytes())
# Record the audio mix to be inserted only once in the final film assembly.
# Each clip starts at its accurate frame-aligned time, not at an arbitrary image cut.
sources=[]
for _,file,start,dur,_ in SLOTS:sources += ["-i",str(VOICE/file)]
filters=[]
for i,slot in enumerate(SLOTS):
 delay=round(slot[2]*1000)
 filters.append("[%d:a]adelay=%d|%d,aresample=48000,volume=1.0[v%d]"%(i,delay,delay,i))
filters.append("".join("[v%d]"%i for i in range(len(SLOTS)))+"amix=inputs=5:normalize=0:duration=longest,alimiter=limit=.90[voices]")
cmd=["ffmpeg","-nostdin","-hide_banner","-loglevel","error","-y",*sources,
 "-filter_complex",";".join(filters),"-map","[voices]","-ac","2","-ar","48000","-t","30.00",str(PUB/"dialogue_mix.wav")]
subprocess.run(cmd,check=True)
print("VOICE_DURATION_SECONDS",script_info)
print("CAPTION_CARDS",len(subtitles),"WORDS",len(all_words))
print("FOLEY_AND_DIALOGUE_MIX_OK",str(PUB/"dialogue_mix.wav"))
