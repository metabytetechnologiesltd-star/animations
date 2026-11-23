"""Generate restrained cinematic Foley — no looping toy motors or recycled sounds."""
import numpy as np,wave,math,os
SR=44100; LENGTH=20;N=SR*LENGTH
rng=np.random.default_rng(20261123)
y=np.zeros(N,dtype=np.float64)
def add(t,signal,scale=1.0):
    pos=int(SR*t)
    if pos>=N:return
    n=min(N-pos,len(signal))
    y[pos:pos+n]+=scale*signal[:n]
def noise_burst(at,secs,amount=.15,lp=0.03):
    n=int(secs*SR)
    white=rng.standard_normal(n);smooth=np.zeros(n)
    for i in range(1,n):smooth[i]=smooth[i-1]*(1-lp)+white[i]*lp
    env=np.exp(-np.linspace(0,7,n))
    add(at,smooth*env,amount)
def thud(t,frequency=72,duration=.5,vol=.25):
    u=np.arange(int(SR*duration))/SR
    envelope=np.exp(-u*13)
    chirp=np.sin(2*np.pi*(frequency*u-35*u*u))*envelope
    add(t,chirp,vol)
# Non-mechanical atmospheric air; low and very quiet.
air=rng.standard_normal(N)
air=np.convolve(air,np.ones(181)/181,mode='same')
y+=air*.023
# Sparse cinematic musical emphasis, never a repetitive motor pulse.
for t,fre,dur,vol in [(0,110,2.7,.024),(3,146.83,2.2,.018),(7.3,98,2.4,.021),(13.3,92.5,5,.025)]:
    u=np.arange(int(dur*SR))/SR
    env=(1-np.exp(-u*4))*np.exp(-u*.6)
    add(t,np.sin(2*np.pi*fre*u)*env,vol)
# Boots on concrete, clipboard, lid, water splash, distant warehouse echoes.
for t in [1.45,2.10,3.18,4.05]:
    thud(t,112,.18,.052);noise_burst(t,.15,.027,.12)
noise_burst(4.65,.30,.07,.16) # clipboard rustle
noise_burst(6.2,.16,.055,.20) # glove touches barrel
thud(7.34,325,.22,.09)       # metal lid latch contact
noise_burst(7.38,.34,.085,.35)
thud(8.18,178,.45,.11)       # steel lid clears rim
noise_burst(8.48,.67,.13,.11) # watery liquid splash
noise_burst(9.1,.65,.08,.05)
thud(11.07,76,.35,.047)      # reaction
thud(13.26,54,.8,.13)       # reveal impact
noise_burst(13.24,.60,.05,.07)
thud(17.1,69,.72,.05)
# End fade and headroom.
fade=np.ones(N); end=int(.7*SR);fade[-end:]=np.linspace(1,0,end)
y*=fade
y=np.tanh(y*1.45)
pcm=(np.clip(y,-1,1)*32767).astype('<i2')
out=os.path.join(os.path.dirname(__file__),'public','foley.wav')
os.makedirs(os.path.dirname(out),exist_ok=True)
with wave.open(out,'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes(pcm.tobytes())
print("FOLEY_WRITTEN",out,len(pcm)/SR)
