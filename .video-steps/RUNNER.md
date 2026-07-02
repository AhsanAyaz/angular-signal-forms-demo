# How to run a work-along step (tool-neutral)

This file tells any coding agent (Claude Code, Gemini CLI, Antigravity) how to execute
one step of the Angular Signal Forms work-along video. It is referenced by the Claude
skill `.claude/skills/run-step` and the Gemini command `.gemini/commands/run-step.toml`.

## Trigger
The user says "run step N" (or "run the next step"), where N is 1..6.

## What you do, in order
1. Read `.video-steps/step-N.md`.
2. For every `FILE: <path>` block in that spec, **overwrite that file with the exact fenced
   contents given**. Do not improvise, reorder, rename, or "improve" the code. The spec is
   the single source of truth so every viewer gets the identical result.
3. Write `STEP-N-EXPLAINED.md` at the repo root using the spec's "Explanation" block verbatim.
4. Print a 3 to 4 line chat recap: what changed, the one key API, and the one-line "try it".
5. Tell the user to save. The dev server (`ng serve`) hot-reloads; do not rebuild unless asked.

## Hard rules
- Apply only the files listed in the step. Leave everything else untouched.
- `STEP-N-EXPLAINED.md` stays <= 12 lines. Keep it skimmable on camera. Include a mermaid
  block only when the spec provides one.
- No em-dashes anywhere (house rule). Use hyphens or colons.
- Do not run `git`. Do not commit. The presenter drives git.
- If `.video-steps/step-N.md` does not exist, say so and stop.

## Notes for the presenter
- Steps are cumulative. Run them in order 1 -> 6 from the `start` branch.
- After step 6 the app equals the finished `main` branch.
