// usage: node design/archive/packing-hero/check_packing.mjs
import assert from "node:assert/strict";
import { BIN, partition } from "./packing.ts";

const volume = BIN.w * BIN.h * BIN.d;

for (let seed = 0; seed < 200; seed++) {
  const boxes = partition(seed);
  assert.equal(boxes.length, 18, `seed ${seed}: ${boxes.length} boxes`);
  const owner = new Map();
  boxes.forEach((b, i) => {
    for (let x = b.x; x < b.x + b.w; x++)
      for (let y = b.y; y < b.y + b.h; y++)
        for (let z = b.z; z < b.z + b.d; z++) {
          assert.ok(x < BIN.w && y < BIN.h && z < BIN.d, `seed ${seed}: box ${i} leaves the bin`);
          const key = `${x},${y},${z}`;
          assert.ok(!owner.has(key), `seed ${seed}: boxes ${owner.get(key)} and ${i} overlap`);
          owner.set(key, i);
        }
  });
  assert.equal(owner.size, volume, `seed ${seed}: bin not filled`);
  boxes.forEach((b, i) => {
    if (b.y === 0) return;
    for (let x = b.x; x < b.x + b.w; x++)
      for (let z = b.z; z < b.z + b.d; z++)
        assert.ok(owner.get(`${x},${b.y - 1},${z}`) < i, `seed ${seed}: box ${i} drops before its support`);
  });
}

console.log("OK: 200 seeds, 18 boxes each, bin filled exactly, every box lands on placed boxes");
