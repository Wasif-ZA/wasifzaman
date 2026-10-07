# Design refresh: context and source files

Everything behind the September 2026 refresh, so it can be understood and continued without the original chat. What was decided and why is in `brief.md`.

## Where things live

| Piece | File |
|---|---|
| The whole desktop: windows, reel, code editor, icons, Start menu, taskbar | `app/components/Desktop.tsx` |
| Shared tile, clock, static window frame, studio taskbar, footer | `app/components/Shell.tsx` |
| Letter wave and scroll motion | `app/components/Motion.tsx` |
| Every project, role and price | `app/lib/data.ts` |
| Window-open animation | `.win-open` in `app/globals.css` |

## Adding a project

1. Add an entry to `PROJECTS` in `app/lib/data.ts`. It appears as a desktop icon, a reel card and a README in the editor.
2. For a project with an interface, save a 1440 by 900 capture of the running thing as `public/projects/<name>.jpg` and set `imgSrc`. Without one, give it an `arch` pipeline instead.
3. Only add a link after it returns 200, then rerun the checks below.

## Tools

| Script | What it checks |
|---|---|
| `tools/check_links.py <base-url>` | Every link on both pages returns 200 and every `#anchor` exists. LinkedIn blocks scripts, so it is listed to open by hand. |
| `tools/click_test.py <base-url>` | Real browser clicks at 1440 and 390 wide: internal links land on the right page, and every desktop icon opens the editor on the right file. |

`archive/packing-hero/` holds the three.js packing scene that was set aside; its README says how to reuse it.

## Checks at the last run

Run on 2026-09-18 against the dev server:

- Typecheck, lint and production build: clean, 7 routes.
- Link checker: 34 links on both pages, 14 distinct external targets, every one returns 200; both `#anchors` exist. LinkedIn is the one link to open by hand.
- Click test: 23 of 23 passed. Internal links land on the right page at 1440 and 390 wide, `/studio#packages` lands with the section at the top, and all 9 desktop icons open the editor on the right file at both widths.
- Gemini 3.8 Flash visual review of both pages: fixed low contrast on faint captions, added previous and next buttons to the Projects window, removed the white offset shadow from the studio call to action. The rest were screenshot artefacts or deliberate (overlapping windows, the peeking reel card, different pinned apps per page).
