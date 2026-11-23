# THE IMPOSSIBLE FRAME — Original Hybrid 3D/2D animation test (21 seconds)

Original fictional thriller, 21 seconds, 1280x720 16:9 24fps.

## Creative intent
At 02:17 AM, a sealed museum vault records no entries. The diamond is gone, but a seal is intact. A reflection appears on the video where no person should stand.

Four real connected ElevenLabs V4 performances: narrator opening (5.44 s), curator (3.84 s), guard (1.92 s), narrator ending (6.88 s), placed by precise audio-start frames 0 / 146 / 255 / 315. **No robotic voices, no captions as a substitute for audio, and no reused toy-car sound.**

## Production method
- Blender exports an original gilded empty diamond exhibit and carved columns as a reusable GLB.
- React 19, React Three Fiber 9, Three.js stage the full 3D museum, rigged character arms, turning vault wheel, animated hinges, and empty exhibit.
- Illustrated 2D canvas hatching is mapped onto 3D walls; graphic-novel ink lines, lettering and a drawn reflection overlay the scene. The shot design is a **hybrid 3D/2D** rather than a flat vector cartoon.
- **Theatre.js Core** loads saved keyframe tracks from `src/theatre-state.js`, which are advanced by the Remotion frame time. Theatre.js Studio is available only as an optional authoring overlay when opening the preview with the `theatreStudio=1` query parameter. Because the legacy `@theatre/r3f` bridge requires Fiber 8, this implementation uses the Core API directly with Fiber 9 and does not force-install the bridge.
- GSAP uses seekable timelines for the 2D typography reveal; react-postprocessing supplies restrained bloom and vignette.
- Remotion is the final video timeline, including four real ElevenLabs voice clips.
- An original generated Foley file places steel wheel clicks, hinges, footsteps, glass taps and a camera playback effect at the displayed action moments.
- GitHub Actions installs the stack and creates the 21s H.264 + AAC MP4 with a 504-frame and audio check.

## Status
Production branch; actual MP4 can be retrieved from the GitHub Actions artifact after workflow passes. Any installed dependencies run inside ephemeral GitHub Actions runners rather than being permanently installed on GitHub. Temporary signed voice URLs are removed from the repo once the runner has checked out.

## Originality and consistency
This story, scene, characters and dialogue are fictional/original. No actual museum or crime is identified. It demonstrates the distinct hybrid 3D/2D option, not a claim of Hollywood film-grade realism. The character rigs and painted aesthetic are starting references for a repeatable asset library.
