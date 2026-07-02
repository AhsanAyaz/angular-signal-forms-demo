---
name: run-step
description: Use when the presenter says "run step N", "run the next step", or "run step 1..6" while recording the Angular Signal Forms work-along video in this repo. Applies that step's pre-baked code changes and writes a short STEP-N-EXPLAINED.md. Always invoke for these phrases; do not hand-write the code yourself.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
---

# run-step

Executes one step of the Signal Forms work-along video.

## What to do
1. Read `.video-steps/RUNNER.md` for the execution rules.
2. Read `.video-steps/step-N.md` for the step the user asked for.
3. Follow RUNNER.md exactly: overwrite each `FILE:` block with its exact contents, write
   `STEP-N-EXPLAINED.md` from the spec's Explanation block, then print a 3 to 4 line recap.

## Rules
- The step spec is the single source of truth. Apply it verbatim; do not improvise code.
- `STEP-N-EXPLAINED.md` stays <= 12 lines. No em-dashes.
- Do not run git or commit. Do not rebuild; the dev server hot-reloads.
- Steps are cumulative and run in order from the `start` branch.
