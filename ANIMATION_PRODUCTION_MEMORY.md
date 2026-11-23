# ANIMATION PRODUCTION MEMORY — authoritative pipeline
Version: 2.2
Last updated: 2026-11-23
Owner: animation YouTube projects, including Second Guess Animations and original long-form documentary work.

## Non-negotiable principle: IMPROVE, NEVER REPLACE
We are **not replacing** our proven pipeline. The original tested chain must remain intact:
**ChatGPT / GPT Image (research, script, art direction, assets) → Blender (actual 3D scenes, models and rigging) → Three.js + React Three Fiber (scene staging, animation, lights and camera) → Remotion (master 16:9 film timeline) → ElevenLabs (human-sounding narration and dialogue) → FFmpeg/FFprobe (sound mixing, H.264 MP4 encoding and verification) → GitHub Actions (reproducible render).**

- Existing real proof: `.github/workflows/maple-heist-20s.yml` succeeded in rendering the original 20-second Great Maple Syrup Heist test with Blender, Three.js, Remotion, ElevenLabs and FFmpeg.
- Never claim a dependency is unavailable merely because it is not installed locally. Use the proven GitHub Actions Linux runners, which can install dependencies per run.
- **React 19.2.8 + React Three Fiber 9.7.0 is now merged into `main` after passing strict npm dependency installation, a 2-second moving 3D/postprocessing/audio check, a 2-second original-action check, and the complete original 20-second (480-frame) Blender/Three.js/Remotion film render with approved voices.** Older React18/R3F8 implementation remains recoverable through Git history.
- **HeyGen, if used, is voice-only** for Second Guess; do not generate the animation through HeyGen.
- Maintain a distinct original aesthetic, *not* a direct copy of the channel being reverse-engineered. Borrow narrative architecture (hooks, editing rhythm and evidence-based explanations), not protected artwork or specific scripts.
- Second Guess's established detailed painterly/inked thriller artwork must not be silently replaced by flat vector cartoons.

## FIVE NEW HIGH-PRIORITY CAPABILITIES — additive layers
1. **Theatre.js** (`@theatre/core`; `@theatre/studio` authoring-only) — time-keyed 3D camera and rig/prop animation; save approved camera takes as project data. **Never assume auto-rigging or real hand contact**. Legacy `@theatre/r3f@0.7.2` requires Fiber8; preserve that legacy editor separately and use Theatre Core values or an explicit adapter under Fiber9. Never force-install the old bridge into React19.
2. **react-postprocessing** (`@react-three/postprocessing`, `postprocessing`) — restrained bloom, vignette, focus/depth, subtle grading. Use 2.x with React18/Fiber8, and 3.x with React19/Fiber9 following peer requirements. Quality gate: do not obscure the subject or hide action mistakes with effects.
3. **GSAP** (`gsap`) — deterministic motion graphics, transforms and in-scene overlays. In Remotion render, seek GSAP timelines to each frame; don't rely on browser clocks or autoplay.
4. **WhisperX** (Python env in `pipeline-tools/whisperx/`) — speech transcription and word-level alignment for ElevenLabs performances, subtitle timing, and lip-sync input; CPU-only allowed for short tests, GPU optional for scale. This is an **optional separate job**, not a mandatory dependency of each film render. Speech alignment itself does **not** generate lip movement; a proper facial rig still required.
5. **HyperFrames** (isolated in `pipeline-tools/hyperframes/`) — optional HTML/CSS/SVG/JavaScript motion-graphics segments (maps, screen displays, numbers, charts, overlays). **Remotion remains the master timeline**. Do not use HyperFrames for HeyGen video generation.

## Build and validation
- `maple-heist/package.json`: pins JS packages that work with the existing project.
- `pipeline-tools/verify-js.cjs`: verifies modules actually installed, checks the unchanged React18/R3F8 stack and test-seeks GSAP to 0.5 s.
- `.github/workflows/animation-toolchain-extensions.yml`: validates Theatre.js, postprocessing and GSAP alongside original deps; installs/tests HyperFrames independently; installs/tests WhisperX in a separate CPU-friendly Python job.
- `.github/workflows/maple-heist-20s.yml` remains the established film-render workflow; its normal install step now runs addon verification. It is not replaced.
- GitHub Actions runners are ephemeral; "installed" means dependencies are declared and installed/verified on each matching run, not permanently installed on GitHub.
- A green install test is **not** a completed cinematic scene. Don't claim an add-on has improved film quality until a new shot using it is rendered and reviewed.

## Required shot/voice/audio quality gates
1. Create original characters, background plates, separate manipulable props, lighting, camera plans and identity/wardrobe continuity bible.
2. Two characters should actually **act**: anticipation → approach → hand/object contact → grasp or release → object motion → physical follow-through → reaction. Avoid disguised slideshows, repeated background cuts, duplicate characters baked into background, and missing mouth synchronization.
3. Generate **natural ElevenLabs speech first**, then derive shot times from real audio duration and WhisperX alignment. Don't speed-stretch a synthetic voice to arbitrary scene lengths. Provide subtitles only as support, never as a substitute for sound.
4. Record or synthesize appropriate original Foley matched to visible contact frames. **Never reuse *The Last Fare* toy-car motor sound for unrelated documentary scenes**. Remove generic repeating low-frequency drones that resemble motors.
5. Produce 16:9 long-form films; 24/30 fps; use native 1080p for approved releases when computationally feasible. Verify exact duration, audio presence, peak levels, readability, camera blocking and action continuity with FFprobe and manual review frames.
6. Historical and business documentaries: source-verify dates, amounts, attribution, and geographic accuracy; label dramatized dialogue and reconstructions clearly. Avoid anachronistic architecture.
7. Deliver **the actual verified MP4** and source/artifact links, not a screenplay or still-image board when the user asks for video. Do not mislabel a rough technical proof as premium finished animation.

## Operation and credentials
- Never commit ElevenLabs API keys or secrets. Voice files are connected-app content; temporary signed asset URLs must not be left in public repositories. A voice-generation run does not imply the MP3 has been mixed into the movie; verify actual audio stream before claiming it.
- Use private GitHub Actions secrets where appropriate. If a signed URL must be used to transfer approved existing voice files, keep it short-lived and remove it after use.
- Keep separate cinematic preview, quality report, frame contact sheet, render logs and final release artifacts.

## GitHub entry points
- Tested film: `maple-heist/`
- Live render workflow: `.github/workflows/maple-heist-20s.yml`
- New extension verifier: `.github/workflows/animation-toolchain-extensions.yml`
- Additive tools: `pipeline-tools/`

## Installation status protocol
After editing dependencies, do not say "installed and verified" until GitHub Actions job for each target succeeds; otherwise report "declared, installation/testing pending or failed" with the failing step, and fix it. Use the CI audit as source of truth.


## Verified CI installation audit — 2026-11-23

All five high-priority capabilities have been installed and successfully smoke-tested in GitHub Actions across the additive verification runs:
- **Theatre.js**: `@theatre/core@0.7.2`, `@theatre/r3f@0.7.2`, `@theatre/studio@0.7.2`.
- **react-postprocessing**: `@react-three/postprocessing@2.16.7` plus `postprocessing@6.39.3` (deliberately compatible with React18/Fiber8/Three0.180).
- **GSAP**: `gsap@3.15.1`; a paused timeline seek to 0.5 sec was tested and returned the expected interpolated value 5.
- **HyperFrames**: `hyperframes@0.9.83`; installed in an isolated module, CLI help test passed; does **not** replace Remotion.
- **WhisperX**: `whisperx@3.8.6`, Python `3.12.16`; installed with PyTorch + Torchaudio, verified Python import and CLI help on a GitHub runner. CPU word-level alignment on real speech has **not yet been benchmarked**.

Evidence:
- JavaScript/HyperFrames passing CI: https://github.com/metabytetechnologiesltd-star/animations/actions/runs/45095632756
- WhisperX passing CI: https://github.com/metabytetechnologiesltd-star/animations/actions/runs/45095459949
- Existing end-to-end movie render (unchanged): https://github.com/metabytetechnologiesltd-star/animations/actions/runs/45092077915

**Do not conflate installation with film quality.** This audit proves the packages and CLI work, not yet that Theatre.js/postprocessing/HyperFrames improve a rendered film shot. Separate visual comparison tests are needed before adopting any effect by default.

## React19/Fiber9 migration — verified and merged into main
- Upgrade PR: https://github.com/metabytetechnologiesltd-star/animations/pull/1 (merged via commit `9609469d7bb72a072b0caeddfbd4708a2e882ea6`).
- Target: React/DOM 19.2.8, Fiber 9.7.0, Drei 10.7.9, Three 0.182.0, postprocessing 3.2.2, core postprocessing 6.39.3, and Remotion 4.0.545 unchanged.
- Theatre 0.7.2 Core and Studio retained; incompatible `@theatre/r3f` bridge isolated for React18/Fiber8-only legacy editing, not loaded in the upgraded film.
- CI must re-render original 480-frame 20-second film with **approved existing voice/audio mix**, using `REMOTION_REACT19_UPGRADE_REGRESSION=1`; normal ElevenLabs audio path stays intact outside regression mode.
- Branch regression workflow: `.github/workflows/react19-r3f9-regression.yml`, passing full-film run: https://github.com/metabytetechnologiesltd-star/animations/actions/runs/45096704289.
- Original-action regression: https://github.com/metabytetechnologiesltd-star/animations/actions/runs/45098154008 (2s/48 frames, actual warehouse actors and barrel GLB).
- Modern postprocessing motion/audio regression: https://github.com/metabytetechnologiesltd-star/animations/actions/runs/45097852550 (2s/48 frames).
- **Observed performance caveat**: full 1280×720 24fps 20s film render on CPU-only software WebGL took **15m51s on upgraded React19/R3F9** versus **6m09s** on the earlier React18/R3F8 stack. This is a material measured slowdown on these runs, not proof of a causal package regression. Profile GL/scene bottlenecks and experiment with faster GPU runners or batching before long-form release. Avoid claiming React19 makes our scenes faster.
- Existing production renderer remains the same Blender -> Three.js -> Remotion -> ElevenLabs -> FFmpeg workflow; this is a version upgrade, not a replacement.


## Selected animation TYPE for original long-form documentary/thriller channel — 2026-11-23
The user explicitly chose **hybrid 3D/2D**, not fully photorealistic 3D or flat 2D graphics. Keep this visual decision consistent across story tests, character rigs, backgrounds, lighting and titles:
- Actual spatial 3D environments and character/prop rigs built with Blender + Three.js/Fiber9; real camera staging and physics-informed actions.
- Graphic-novel/painterly 2D ink hatching, textured materials, animated accent strokes and illustrated screen overlays that sit naturally within the 3D scene.
- Strong cinematic teal/navy shadows and warm highlights with subtle post-processing rather than plasticky, flat cartoons.
- Theatre.js Core for frame-addressable camera and action tracks; Studio available for authoring but not embedded into final video.
- ElevenLabs natural human voices; authored Foley with exact on-contact cues; Remotion master timeline; FFmpeg output.
- This selects an **animation category**, not a particular permanent protagonist. Do not confuse the user's previous request for three animation TYPES with three clothing variations of one character.
- Preserve the pre-existing Second Guess Animations painted thriller identity; document the long-form documentary style independently instead of overwriting it.
- First reference implementation: branch `film/hybrid-3d2d-impossible-frame`, folder `hybrid-vault/`. Rendering and user review determine whether its visual fidelity is approved; successful technical rendering alone is not artistic approval.


## Long-form finance documentary test — Wirecard €1.9bn / 30 seconds (2026-11-23)

- User now wants original **long-form financial scandal and corporate investigation documentaries**, reverse-engineering successful documentary pacing, not their scripts/artwork. Prototype: **The €1.9 Billion Mirage**, original 30-second Wirecard 2020 cold open, 11 shots; project branch `film/wirecard-hybrid-finance-30s`, folder `wirecard-30s/`, successful render run https://github.com/metabytetechnologiesltd-star/animations/actions/runs/45116529068.
- Selected visual **hybrid 3D/2D** maintained: real Blender geometry and Three.js hand/prop animation combined with original illustrated/motion-graphic overlays. Current procedural characters still look toy-like; do **not** call this a premium finished model standard. Next character development must improve silhouettes, hand constraints, anatomy, facial blendshapes, wardrobe, and motion arcs.
- **Subtitles are mandatory** for these documentary videos. Burn in high-contrast short caption cards on a near-opaque dark bottom panel; 2 lines max, white body text, a highlighted active word, and avoid blocking faces/important props. Export optional separate SRT as well. Test screenshot pixel content, not just existence of an SRT file. The 30-second prototype has 14 caption cards covering narration and dialogue, using estimated weighted word timing; **WhisperX actual forced alignment** remains the next accuracy upgrade. Do not claim sample-accurate captions until actually aligned.
- **Voice-first synchronization**: download approved existing natural ElevenLabs MP3s into CI; derive exact clips, mouth opening amplitude, phrase timings, and timeline from recordings. Audio-derived mouth opening is an improvement over sinusoidal mouth loops but is NOT full phoneme/viseme synchronization.
- **Blender → Three.js axis pitfall**: assets authored in Three.js-style Y-up coordinates inside Blender were accidentally glTF-exported with its default Y-up coordinate conversion, turning the floor into a giant vertical wall and blanking the whole view. For such specially Y-up authored assets, export with `bpy.ops.export_scene.gltf(..., export_yup=False)`, or (preferred long term) author native Blender Z-up and let exporter convert. Validate resulting GLB bounds and rendered camera frames. **Do not blindly apply export_yup=False to ordinary Z-up Blender projects.**
- A successful MP4 encode does not prove actual 3D visibility. The Wirecard preflight first produced flat gray frames and passed a trivial file-size check. Add a **scene-variance gate** measuring non-overlaid middle-frame RGB standard deviation and manually inspect 4+ screenshots before full rendering. A workflow must fail on blank/occluded 3D content.
- Treat React postprocessing on CPU software WebGL with caution: prior 21-second hybrid test blanked when running the postprocessing pass. Keep finishing safely in Remotion CSS/2D until a visual A/B confirms valid WebGL postprocessing; keep library installed, do not uninstall.
- For CPU-only GitHub runners, render 30s at 24 fps 1280×720 as **four 180-frame parallel Remotion chunks**, then FFmpeg concat and mix the existing voice WAV + original Foley once, followed by FFprobe verification of 30.000 s, 720 frames, resolution and audio. Review actual contact sheet and a sound-level/silence report.
- For real scandals, cross-check documentary dates, losses, banks and corporate names against primary disclosures and regulator reports. Mark fictional staff interactions clearly as **DRAMATIZED DIALOGUE**, not actual quotations.
- Existing pipeline remains intact: **Blender + Three.js/Fiber9 + Remotion + ElevenLabs + FFmpeg + GitHub Actions**. Theatre.js Core/Studio, GSAP, WhisperX and HyperFrames are additive only, not compulsory in every shot.
