# Archive

## packing-hero

prunable: no. Kept on 2026-09-18 for reuse in another project; the owner liked it but it is not the portfolio's direction.

A live three.js scene: a 6 by 4 by 4 bin is cut into 18 cartons that fill it exactly, and they drop in bottom-up so each lands on one already placed. The scene tilts toward the cursor, turns and lifts with scroll, and repacks a new split about every 7 seconds. With reduced motion it renders the packed bin once and stays still. Rendering pauses while the canvas is off screen.

| File | What it is |
|---|---|
| `PackingHero.tsx` | React client component, default export. Size it with a parent box; it fills `h-full w-full`. Loads `three` on demand. |
| `packing.ts` | `partition(seed)`: the split and the drop order, no dependencies. |
| `check_packing.mjs` | `node check_packing.mjs`: 200 seeds, bin filled exactly, no overlap, every carton lands on placed ones. |

To reuse: copy the three files into a Next.js or React app, `npm install three` and `npm install -D @types/three`, then render `<PackingHero className="h-full w-full" />` inside a sized, positioned box. Colours are the constants at the top of `PackingHero.tsx`.
