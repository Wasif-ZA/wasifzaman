export type Box = { x: number; y: number; z: number; w: number; h: number; d: number };
type Axis = "w" | "h" | "d";

export const BIN = { w: 6, h: 4, d: 4 };
const COUNT = 18;

export function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Guillotine-splits the bin on a unit grid, so the pieces fill it exactly, then orders them bottom-up. */
export function partition(seed: number, count = COUNT): Box[] {
  const rand = random(seed);
  const boxes: Box[] = [{ x: 0, y: 0, z: 0, ...BIN }];
  const pos: Record<Axis, "x" | "y" | "z"> = { w: "x", h: "y", d: "z" };
  while (boxes.length < count) {
    const splittable = boxes
      .filter((b) => Math.max(b.w, b.h, b.d) >= 2)
      .sort((a, b) => b.w * b.h * b.d - a.w * a.h * a.d);
    if (!splittable.length) break;
    const box = splittable[Math.floor(rand() * Math.min(3, splittable.length))];
    const axis = (["w", "h", "d"] as Axis[]).filter((a) => box[a] >= 2).sort((a, b) => box[b] - box[a])[0];
    const cut = 1 + Math.floor(rand() * (box[axis] - 1));
    const rest = { ...box, [axis]: box[axis] - cut, [pos[axis]]: box[pos[axis]] + cut };
    boxes.splice(boxes.indexOf(box), 1, { ...box, [axis]: cut }, rest);
  }
  return boxes.sort((a, b) => a.y - b.y || a.x + a.z - (b.x + b.z));
}
