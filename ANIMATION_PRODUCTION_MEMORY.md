# ANIMATION PRODUCTION MEMORY — authoritative pipeline
Version: 2.0
Last updated: 2026-11-23
Owner: animation YouTube projects, including Second Guess Animations and original long-form documentary work.

## Non-negotiable principle: IMPROVE, NEVER REPLACE
We are **not replacing** our proven pipeline. The original tested chain must remain intact:
**ChatGPT / GPT Image (research, script, art direction, assets) → Blender (actual 3D scenes, models and rigging) → Three.js + React Three Fiber (scene staging, animation, lights and camera) → Remotion (master 16:9 film timeline) → ElevenLabs (human-sounding narration and dialogue) → FFmpeg/FFprobe (sound mixing, H.264 MP4 encoding and verification) → GitHub Actions (reproducible render).**

- Existing real proof: `.github/workflows/maple-heist-20s.yml` succeeded in rendering the original 20-second Great Maple Syrup Heist test with Blender, Three.js, Remotion, ElevenLabs and FFmpeg.
- Never claim a dependency is unavailable merely because it is not installed locally. Use the proven GitHub Actions Linux runners, which can install dependencies per run.
- Keep React 18 + React Three Fiber 8 + Remotion 4 compatible until a deliberate tested migration is approved. Do not force React 19 into the working production.
- **HeyGen, if used, is voice-only** for Second Guess; do not generate the animation through HeyGen.
- Maintain a distinct original aesthetic, *not* a direct copy of the channel being reverse-engineered. Borrow narrative architecture (hooks, editing rhythm and evidence-based explanations), not protected artwork or specific scripts.
- Second Guess's established detailed painterly/inked thriller artwork must not be silently replaced by flat vector cartoons.

## FIVE NEW HIGH-PRIORITY CAPABILITIES — additive layers
1. **Theatre.js** (`@theatre/core`, `@theatre/r3f`; `@theatre/studio` authoring-only) — time-keyed 3D camera and rig/prop animation; save approved camera takes as project data. **Never assume auto-rigging or real hand contact**.
2. **react-postprocessing** (`@react-three/postprocessing`, `postprocessing`) — restrained bloom, vignette, focus/depth, subtle grading. Use a compatible 2.x package on React 18 + Fiber 8; 3.x currently expects React 19 + Fiber 9. Quality gate: do not obscure the subject or hide action mistakes with effects.
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
