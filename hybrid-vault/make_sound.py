"""Original cinematic foley bed: no reuse from earlier animation shorts, and no toy-motor drone."""
import os,wave,numpy as np
RATE=44100;DUR=21;N=RATE*DUR
y=np.zeros(N);rng=np.random.default_rng(84613)
def insert(t,s,amp=1):
  i=int(t*RATE);z=min(len(s),N-i)
  if z>0:y[i:i+z]+=s[:z]*amp
def tone(t,f,dur,amp=.02):
  x=np.arange(int(RATE*dur))/RATE
  a=(1-np.exp(-x*7))*np.exp(-x/max(.1,dur)*2.1)
  insert(t,(np.sin(2*np.pi*f*x)+.28*np.sin(2*np.pi*(f/2)*x))*a,amp)
def hit(t,f=100,amp=.09,decay=18):
  x=np.arange(int(RATE*.5))/RATE
  s=np.sin(2*np.pi*(f*x-24*x*x))*np.exp(-x*decay)
  insert(t,s,amp)
def scratch(t,dur=.35,amp=.04,rate=.012):
  x=rng.normal(size=int(RATE*dur));sm=np.zeros_like(x)
  for i in range(1,len(x)):sm[i]=sm[i-1]*(1-rate)+x[i]*rate
  env=np.sin(np.pi*np.arange(len(x))/len(x))**2
  insert(t,sm*env,amp)
# Quiet distant museum ventilation and original restrained suspense score.
ambient=rng.normal(size=N)
# Efficient smoothing with one box-convolution per channel
sm=np.convolve(ambient,np.ones(125)/125,mode="same")
y+=sm*.012
for t,f,d,amp in [(0,98,4.1,.033),(3.45,111,3.0,.019),(6.05,73.4,4.0,.027),(10.1,82.4,2.7,.025),(13.0,55.1,7.8,.034),(17.1,146.83,3.3,.018)]:
 tone(t,f,d,amp)
# Real actions: footsteps, lock pins, wheel friction, door hinge, glass.
for t in [1.55,2.15,2.85,3.28,6.61,7.03]:hit(t,130,.06,32);scratch(t,.13,.02)
for t in [3.58,4.03,4.51,5.05,5.61]:hit(t,280,.10,46);scratch(t,.13,.037)
scratch(5.8,1.7,.065,.07) # heavy vault door moving
hit(6.34,81,.18,16)
scratch(7.72,.25,.04,.16) # gloved hand touches glass
hit(8.28,430,.042,38) # glass tap
hit(10.20,130,.05,36) # guard turns to speak
# Camera shutter and revelation.
hit(13.11,640,.060,55);scratch(13.25,.09,.025,.3)
hit(15.70,63,.19,15)
scratch(17.05,.67,.052,.04)
hit(17.22,54,.20,17)
# End silence taper.
fade=int(.9*RATE);y[-fade:]*=np.linspace(1,0,fade)
y=np.tanh(y*1.4);pcm=(np.clip(y,-1,1)*32767).astype("<i2")
out=os.path.join(os.path.dirname(__file__),"public","sound_design.wav")
os.makedirs(os.path.dirname(out),exist_ok=True)
with wave.open(out,"wb") as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(RATE);f.writeframes(pcm.tobytes())
print("SOUND_DESIGN_OK",out,len(pcm)/RATE)
