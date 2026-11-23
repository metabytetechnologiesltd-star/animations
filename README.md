# Stickman Animation Render Engine

Public, source-only Blender + GitHub Actions test environment for an original Boston Molasses Flood animation.

## First test

Run [Boston Molasses - 12s Blender Rig and Camera Test](.github/workflows/molasses-approval.yml) from Actions. The job renders 288 frames at 24 fps (960×540) with an original procedural historical environment, a rigged figure, dynamic liquid/debris, and four keyed camera shots. The render is **a technical motion test, not the final approved illustrated assets**, and contains **no narration**. Review MP4 and four images from the Actions artifact `molasses-blender-12s-approval` before authorizing any full video.

## Privacy and assets

No private repositories, credentials, `.env` files, private audio, or previously approved third-party-generated artwork are published here. The earlier private production project remains separate.


## Current animation production pipeline (2026-11-23)

**This repository preserves and improves the original film pipeline; it does not replace it.**

Read the [Animation Production Memory / Bible](ANIMATION_PRODUCTION_MEMORY.md) before producing or editing any film.

Core: **ChatGPT + GPT Image → Blender → Three.js + React Three Fiber → Remotion (master timeline) + ElevenLabs → FFmpeg → GitHub Actions**.

Five additive high-priority capabilities:
**Theatre.js**, **react-postprocessing**, **GSAP**, **WhisperX**, **HyperFrames**.
Theatre.js improves camera/prop keyframes, postprocessing improves finishing, GSAP coordinates deterministic motion, WhisperX aligns natural speech, and HyperFrames creates optional motion-graphic inserts; none replaces the core.

Run [Animation Pipeline Extension Verification](.github/workflows/animation-toolchain-extensions.yml) to validate version compatibility and test the tools in GitHub Actions before using them in a film. The original successful Maple Heist pipeline remains at [maple-heist](maple-heist/).

### Verified React 19 / Fiber 9 production upgrade

**Production engine updated on 2026-11-23:** React 19.2.8, React Three Fiber 9.7.0, Drei 10.7.9, Three.js 0.182.0, react-postprocessing 3.2.2. Blender, Remotion 4, ElevenLabs, FFmpeg, Theatre.js Core/Studio, GSAP, WhisperX and HyperFrames remain in the workflow. Theatre.js's old `@theatre/r3f` bridge was retained in the isolated React18/Fiber8 legacy editor, not force-installed into modern Fiber9.

[Migration PR #1](https://github.com/metabytetechnologiesltd-star/animations/pull/1) passed [the full original 20s/480-frame film regression](https://github.com/metabytetechnologiesltd-star/animations/actions/runs/45096704289), [the original action smoke](https://github.com/metabytetechnologiesltd-star/animations/actions/runs/45098154008), and [the modern postprocessing render test](https://github.com/metabytetechnologiesltd-star/animations/actions/runs/45097852550).

**Measured performance limitation:** the same 20s scene took ~15m51 on CPU software WebGL after upgrading, versus ~6m09 in the older baseline run. This has not been optimized; do not imply a speed improvement. See [production memory](ANIMATION_PRODUCTION_MEMORY.md) for details.
