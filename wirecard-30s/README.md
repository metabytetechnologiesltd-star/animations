# The €1.9 Billion Mirage — Original 30-second finance thriller

**Purpose:** A fresh business-crime documentary cold open using the narrative pace of successful corporate-scandal channels, with completely original artwork and a distinctive hybrid 3D/2D style, 16:9. This is not a recreation of anyone else's specific script or footage.

## Historical basis
- On **18 June 2020**, Wirecard announced EY lacked sufficient evidence to verify €1.9bn of trustee-account cash.
- On **22 June 2020**, Wirecard assessed that the €1.9bn cash balances likely did not exist.
- On **25 June 2020**, Wirecard filed for insolvency.
Sources:
https://wirecard.com/wp-content/uploads/2021/01/AH_2020_06_18_Delay-publication-fin-statement-2019_spurious-balance.pdf
https://wirecard.com/wp-content/uploads/2021/01/AH_2020_06_22_Statement-Board.pdf
https://www.esma.europa.eu/sites/default/files/library/esma42-111-5349_fast_track_peer_review_report_-_wirecard.pdf

The auditorium conversation is **fictional dramatization**; it is not a historical transcript. Location architecture and fictional character designs are artistic recreations.

## Quality improvements over earlier test
- **All 30 seconds contain burned-in, readable short-phrase subtitles** with highlighted current words, dark opaque background, and high contrast; also exported as .srt. These word times are proportional timings based on the approved speech and should be considered *approximate*, pending optional WhisperX forced-alignment refinement.
- **Natural ElevenLabs recordings** for narrator, female auditor and male executive, mixed from the original actual recordings and not approximated TTS.
- **Characters are animated separately in Three.js**, with facial mouth opening driven by the energy of their actual recorded MP3 performances.
- **A real report slides on the desk and is physically contacted by characters**, plus stamp contact, typed keyboard motion and detailed original 3D office sets exported from Blender.
- **11 discrete directed shots** over 30 seconds with 2D business infographics, keyframe camera work, textured 3D sets, original Foley, and a strong original title/hook.
- Remotion 4 and React 19 / React Three Fiber 9 remain production engine. Theatre.js Core is loaded for camera authoring metadata; Studio is available to the authoring environment. No incompatible Theatre R3F8 bridge.
- **No React postprocessing render pass** in this CPU-only GitHub pipeline after the prior black-scene defect; cinematic finishing is handled by safe 2D HTML overlays in Remotion. The postprocessing add-on remains installed and available for GPU workflows.
- Render is split across four GitHub runners (each 7.5s / 180 frames), then concatenated and mixed through FFmpeg.

## User requirements
User chose hybrid 3D/2D for original long-form financial documentary animations. This is a **30-second test**, not an 8–10-minute finished episode, and is separate from the Second Guess short-fiction channel. Do not use moving stills as a substitute for the scripted 3D action. Preserve sound synchronization and captions in every long-form scene.
