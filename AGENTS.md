# Angular Signal Forms - work-along demo

This is the companion app for the "Angular Signal Forms Tutorial" video. It is built up
live, one step at a time, so viewers can follow along.

## Running steps (Claude Code, Gemini CLI, Antigravity)
When the presenter says **"run step N"** (N is 1..6), or `/run-step N`:
1. Read `.video-steps/RUNNER.md` (the execution rules).
2. Read `.video-steps/step-N.md` (the step spec).
3. Apply each `FILE:` block verbatim, write `STEP-N-EXPLAINED.md` from the spec's
   Explanation block, and print a short recap.

The step specs are pre-baked and are the single source of truth. Do not improvise the code,
do not run git, and do not rebuild (the dev server hot-reloads). Keep each EXPLAINED file at
12 lines or fewer. No em-dashes anywhere.

Steps are cumulative and run in order from the `start` branch. After step 6 the app equals
the finished `main` branch.

## Stack
Angular v22 (zoneless), Signal Forms from `@angular/forms/signals`, Tailwind + daisyUI.
Standalone components, native control flow (`@if` / `@for`), `signal` / `computed` / `effect`,
`inject()`. Do not add NgModules or `ControlValueAccessor`.
