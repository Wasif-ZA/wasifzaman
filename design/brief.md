# Design refresh: brief

The portfolio as a desktop you sit down at to work. Decided with the owner on 2026-09-18, after two other directions.

## The two pages

**`/` is a desktop.**

- The name is the wallpaper: huge Outfit type whose letters rise in on load and thicken near the cursor.
- Desktop icons on the left: one per project (a thumbnail of its real screenshot, or a lime monogram when it has no interface), Experience, and the CV.
- A Windows-style taskbar along the bottom: Start (WZ), Projects, Code, CV, Email, and a tray with GitHub, LinkedIn and a clock.
- The Projects window is open on load: a sideways reel of real project screenshots. The mouse wheel scrolls it sideways.
- Opening a project brings up the Code window, laid out like a code editor: an explorer of `projects/<name>/README.md` files and `about/experience.md`, tabs, the README with line numbers, and a preview pane showing the real screenshot or pipeline drawing.
- Windows drag by the title bar, come to the front when clicked, and close with the close button or Esc; focus returns to whatever opened them.
- On a phone there is no dragging: the reel sits inline, the icons form a grid, the Code window opens full screen above the taskbar, and every file is a tab.

**`/studio` is a normal scrolling page in the same look.** Dark only, lime as the one accent, window frames around the packages and both client builds, and the same taskbar.

## What stays

- All copy in `app/lib/data.ts`.
- Project images are captures of the running thing, or the `ArchDiagram` drawing for projects with no interface.
- Fonts: Outfit (display), Geist Mono (labels and the editor).
- Colours: ink `#0B0B0D`, acid lime `#CEFF1A`, paper `#F4F1EA`.

## Rules

1. Nothing important hides behind a click: the Projects window is open on load, and the CV and email are on the taskbar.
2. Every window's content is in the page while closed, so search engines and screen readers get it.
3. With reduced motion there is no letter wave, no weight effect and no window animation.
4. Real copy only: no invented numbers, testimonials, logos or people.
5. No new packages. Dragging is plain pointer events.

## Decisions

- **Clay 3D objects on lime and paper bands: rejected.** That was Finarchitect's look; the owner asked for a different, eye-catching direction.
- **Live three.js packing hero: set aside.** Liked, but not this site's direction. Kept for reuse in `archive/packing-hero/`, and `three` was uninstalled.
- **Desktop over a scrolling reel.** The owner asked for the reel and the desktop mixed, with a little kinetic type, then for a Windows-style taskbar and projects that open like working in a code editor.
- **Studio stays a normal page.** Small-business owners need to reach the prices in one scroll, so the desktop stays the recruiter experience.
- **Projects added:** sprawll (linked to PyPI; the repo is private) and Finarchitect (linked to the live site; described only from the live site and its repo, with no people named).
- **Close buttons turn red on hover,** as on Windows. It is the only colour besides lime and it appears only on hover.
