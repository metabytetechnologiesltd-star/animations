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
