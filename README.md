<p align="center">
  <a href="https://www.wasifzaman.tech"><strong>Live site</strong></a> &middot;
  <a href="#run-it"><strong>Run it</strong></a> &middot;
  <a href="#editing-content"><strong>Editing content</strong></a> &middot;
  <a href="#design-rules"><strong>Design rules</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000" alt="Next.js 16">
  <img src="https://img.shields.io/badge/Tailwind-v4-38BDF8" alt="Tailwind CSS v4">
  <img src="https://img.shields.io/badge/motion-GSAP-88CE02" alt="GSAP">
  <img src="https://img.shields.io/badge/hosted%20on-Vercel-000000" alt="Vercel">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT">
</p>

<br>

# wasifzaman is a portfolio you use like a desktop.

Wasif Zaman's personal site, live at **[wasifzaman.tech](https://www.wasifzaman.tech)**.

**If a CV is the _summary_, this site is the _working copy_: every project opens, runs or links to its code.**

`/` is a dark desktop for engineering roles. Projects open in a code-editor window, with a
Windows-style taskbar along the bottom. `/studio` is a scrolling page in the same look for web
studio clients.

**Every link returns 200. Every claim comes from the CV or the project's own README.**

|        | Step      | Example                                           |
| ------ | --------- | ------------------------------------------------- |
| **01** | Install   | _`npm install`_                                   |
| **02** | Run       | _`npm run dev`, then open http://localhost:3000_  |
| **03** | Edit copy | _Change `app/lib/data.ts`; the pages follow._     |

> [!TIP]
> **🖥️ Or hand it to your agent.** Paste this into Claude Code or Codex:
>
> ```text
> Clone https://github.com/Wasif-ZA/wasifzaman, run `npm install` and `npm run dev`,
> then open http://localhost:3000 and show me the desktop and /studio.
> ```

<br>

## Why this site is different

|                                  |                                                                                   |
| -------------------------------- | --------------------------------------------------------------------------------- |
| **Links are checked first.**     | A link is added only after it returns 200. Look-alike domains are left out.       |
| **Real output or nothing.**      | Project tiles are captures of the running thing, never stock images.              |
| **Pipelines get a drawing.**     | A project with no interface gets a pipeline drawn by `ArchDiagram.tsx`.          |
| **One file of copy.**            | All text lives in `app/lib/data.ts`. Components only lay it out.                  |
| **No phone number to scrape.**   | The served CV has the mobile number redacted out of the PDF.                      |

<br>

## Run it

Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Editing content

All copy lives in `app/lib/data.ts`: `PROJECTS`, `EXPERIENCE`, `EDUCATION`, `CERTIFICATES`,
`TOOLBOX`, and for the studio page `SERVICES`, `WEEK` and `STUDIO_TERMS`. A new entry in
`PROJECTS` becomes a desktop icon, a reel card and a README in the editor. See
`design/README.md`.

<details>
<summary>Open: the served CV, and how to check it is clean</summary>

`public/resume.pdf` is a web variant. The mobile number is redacted out of the content stream.
Email, GitHub, LinkedIn and the site URL remain. The original lives outside this repository.

If you regenerate the CV, redact it again before committing. Check with:

```bash
python -c "import re;from pypdf import PdfReader;print(bool(re.search(r'04\d\d', ''.join(p.extract_text() or '' for p in PdfReader('public/resume.pdf').pages))))"
```

`False` means clean.

</details>

## How it is built

<details>
<summary>Open: stack and layout</summary>

| Piece | What |
|---|---|
| Framework | Next.js 16, App Router, Turbopack |
| Language | TypeScript |
| Styling | Tailwind CSS v4, tokens in `app/globals.css` under `@theme inline` |
| Animation | GSAP with ScrollTrigger, through `@gsap/react` |
| Fonts | Outfit (display), Geist Mono (labels), via `next/font` |
| Hosting | Vercel |

```
app/
  page.tsx           engineering page (/): renders the desktop
  studio/page.tsx    web studio page (/studio)
  layout.tsx         metadata, fonts
  lib/data.ts        all site copy
  lib/site.ts        canonical URL, title, description
  components/
    Desktop.tsx      windows, project reel, code editor, icons, Start menu, taskbar
    Shell.tsx        tile, clock, window frame, studio taskbar, footer
    Motion.tsx       GSAP wrappers: ScrubText, ScaleFade, Rise, PinnedSplit, WaveTitle, FlipIn
    ArchDiagram.tsx  pipeline drawing for projects with no interface
  globals.css        palette tokens, focus rings, reduced-motion
  opengraph-image.tsx, sitemap.ts, robots.ts
public/
  projects/          project screenshots
  resume.pdf         the served CV
design/              brief, design notes, link and click checks
```

</details>

## Design rules

- Ink ground `--ink: #0B0B0D`, paper text `--paper: #F4F1EA`, one theme for both pages
- One accent, acid green `--acid: #CEFF1A`; the front window carries a hard lime shadow
- Square corners, bold uppercase display type, Geist Mono for labels and the editor
- Film grain over the page (`.grain`)

## Accessibility

- An acid green `:focus-visible` outline on every interactive element
- Windows are labelled dialogs. Esc closes the focused one and focus returns to what opened it
- Every window's content stays in the page while closed
- `prefers-reduced-motion` is honoured in CSS, in every GSAP wrapper, and in the letter-weight effect

## License

MIT. See [LICENSE](LICENSE).
