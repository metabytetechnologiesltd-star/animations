# Theatre.js legacy keyframe editor (isolated compatibility module)

Theatre.js 0.7.2's `@theatre/r3f` declares React Three Fiber 8 support, not Fiber 9; it must not be force-installed into the React 19 production project. The `@theatre/core` and `@theatre/studio` packages remain installed with the modern film stack.

This optional standalone package pins the original React 18 / Fiber 8 editor dependency set for anyone needing Theatre's legacy visual R3F editor. Export the approved Theatre project JSON and consume it through the version-compatible Theatre Core API and an explicit custom runtime property-binding adapter in the React 19 / Fiber 9 production project. **This is a separate editor workbench, not a second video-rendering pipeline.**

`npm install` here only if the old editor is needed. The upgraded Remotion project continues to render with React 19 and Fiber 9.
