# The Great Maple Syrup Heist — original animated documentary (20s)

An original, cinematic 3D documentary experiment about the 2012 Quebec strategic maple syrup reserve theft. **This is not the Barings film.** Dialogue is dramatized, not an historical quotation.

## Verified factual anchor
The Supreme Court of Canada notes the theft was discovered at Saint-Louis-de-Blandford in July 2012 when barrels contained water instead of syrup; stolen syrup was worth over CAD $18 million. Official case brief: https://scc-csc.gc.ca/pdf/cb/2022/39162-eng.pdf

## Production technology
- **Blender 4:** `blender/build_barrel.py` builds a proprietary original 3D barrel GLB with timber staves and iron hoops.
- **Three.js + React Three Fiber:** `src/index.jsx` constructs a warehouse set, camera moves, inspectors, independent barrel lid and water visualization.
- **Remotion:** One 480-frame, 24fps timeline (20 seconds), 1280x720 16:9, overlay captions and synchronized MP3 clips.
- **ElevenLabs v4:** One North-American documentary narrator, one female inspector, one male warehouse worker. Recordings are generated via the connected ElevenLabs account.
- **Python + NumPy:** `generate_foley.py` generates original one-off footfalls, lid clicks and splashes; no reusable toy motor noises.
- **FFmpeg / FFprobe:** Encode and validate media, duration, dimensions and sound.
- **GitHub Actions:** `.github/workflows/maple-heist-20s.yml` installs dependencies, exports GLB, fetches existing voice recordings, renders preview and MP4, uploads artifact.

## Security and future runs
The first CI run used temporary signed speech-file URLs to transfer audio from ElevenLabs without exposing an API key. Those URLs have been removed from the public repo after checkout; **re-running the full workflow will require fresh authorized voice-file URLs** added temporarily, or a future private-secret integration. You never need to expose an ElevenLabs API key in chat.

## Scene timeline
- 0–3s: Reveal the vast warehouse of inventory barrels.
- 3–8.3s: Inspector walks toward the suspicious barrel, unlatches lid.
- 8.3–11s: Lid rises; blue water is revealed; inspector speaks.
- 11–13.2s: Colleague reacts.
- 13.2–20s: Pullback reveals the reserve; C$18M+ loss and documentary title.

## Historical distinction
The short film's acted lines are fictionalized recreations. The theft and discovery are factual. This is a proof of the code-driven 3D production pipeline, not evidence that every movement in a historical record occurred as shown.
