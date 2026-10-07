"use client";

import { useEffect, useRef } from "react";
import { BIN, partition, random } from "./packing";

const GAP = 0.07;
const DROP = 0.75;
const STAGGER = 0.13;
const HOLD = 2.8;
const LIFT = 1.1;
const ACID = 0xceff1a;
const PAPER = 0xf4f1ea;

const easeOutBack = (k: number) => 1 + 2.2 * (k - 1) ** 3 + 1.2 * (k - 1) ** 2;
const clamp = (v: number) => Math.min(1, Math.max(0, v));

export default function PackingHero({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let cancelled = false;
    let teardown = () => {};

    import("three").then((THREE) => {
      if (cancelled) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch {
        return;
      }
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 2.2);
      key.position.set(6, 10, 7);
      scene.add(key);
      const rim = new THREE.DirectionalLight(ACID, 0.9);
      rim.position.set(-8, 2, -6);
      scene.add(rim);

      const rig = new THREE.Group();
      scene.add(rig);
      const bin = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(BIN.w + 0.2, BIN.h + 0.2, BIN.d + 0.2)),
        new THREE.LineBasicMaterial({ color: PAPER, transparent: true, opacity: 0.22 })
      );
      rig.add(bin);

      const dark = new THREE.MeshStandardMaterial({ color: 0x1b1b21, roughness: 0.38, metalness: 0.35 });
      const lime = new THREE.MeshStandardMaterial({ color: ACID, roughness: 0.3, metalness: 0.1 });
      const edgeLime = new THREE.LineBasicMaterial({ color: ACID });
      const edgeInk = new THREE.LineBasicMaterial({ color: 0x0b0b0d });

      type Piece = { group: InstanceType<typeof THREE.Group>; home: InstanceType<typeof THREE.Vector3>; spin: number };
      let pieces: Piece[] = [];
      let cycle = 0;
      let start = performance.now() / 1000;

      const build = () => {
        pieces.forEach(({ group }) => {
          rig.remove(group);
          group.children.forEach((c) => (c as InstanceType<typeof THREE.Mesh>).geometry.dispose());
        });
        const boxes = partition(cycle * 7919 + 17);
        pieces = boxes.map((b, i) => {
          const geo = new THREE.BoxGeometry(b.w - GAP, b.h - GAP, b.d - GAP);
          const accent = i % 5 === 2;
          const group = new THREE.Group();
          group.add(new THREE.Mesh(geo, accent ? lime : dark));
          group.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), accent ? edgeInk : edgeLime));
          const home = new THREE.Vector3(b.x + b.w / 2 - BIN.w / 2, b.y + b.h / 2 - BIN.h / 2, b.z + b.d / 2 - BIN.d / 2);
          rig.add(group);
          return { group, home, spin: (random(cycle * 31 + i)() - 0.5) * 1.6 };
        });
      };
      build();

      const size = () => {
        const { clientWidth: w, clientHeight: h } = canvas;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const far = Math.max(1.25, 1.2 / (w / h));
        camera.position.set(10 * far, 7.2 * far, 12 * far);
        camera.lookAt(0, -0.2, 0);
        camera.updateProjectionMatrix();
      };
      size();

      const pointer = { x: 0, y: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.x = e.clientX / window.innerWidth - 0.5;
        pointer.y = e.clientY / window.innerHeight - 0.5;
      };

      const place = (t: number) => {
        const done = (pieces.length - 1) * STAGGER + DROP;
        pieces.forEach((p, i) => {
          const k = clamp((t - i * STAGGER) / DROP);
          const out = clamp((t - done - HOLD - (pieces.length - 1 - i) * 0.03) / LIFT);
          const e = easeOutBack(k);
          p.group.visible = k > 0 && out < 1;
          p.group.position.set(p.home.x, p.home.y + (1 - e) * 7 + out * out * 9, p.home.z);
          p.group.rotation.y = (1 - e) * p.spin;
          p.group.scale.setScalar(1 - out * 0.6);
        });
        return t > done + HOLD + LIFT + 0.03 * pieces.length;
      };

      if (still) {
        pieces.forEach((p) => p.group.position.copy(p.home));
        renderer.render(scene, camera);
      }

      let frame = 0;
      let visible = true;
      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        const now = performance.now() / 1000;
        if (place(now - start)) {
          cycle += 1;
          build();
          start = now;
        }
        const rect = canvas.getBoundingClientRect();
        const scrolled = clamp(-rect.top / Math.max(rect.height, 1));
        rig.rotation.y += (pointer.x * 0.5 + Math.sin(now * 0.25) * 0.12 + scrolled * 1.1 - rig.rotation.y) * 0.05;
        rig.rotation.x += (pointer.y * 0.2 - rig.rotation.x) * 0.05;
        rig.position.y = scrolled * 2.2;
        renderer.render(scene, camera);
      };

      const resize = new ResizeObserver(() => {
        size();
        if (still) renderer.render(scene, camera);
      });
      resize.observe(canvas);
      const seen = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      seen.observe(canvas);
      if (!still) {
        window.addEventListener("pointermove", onPointer);
        tick();
      }

      teardown = () => {
        cancelAnimationFrame(frame);
        resize.disconnect();
        seen.disconnect();
        window.removeEventListener("pointermove", onPointer);
        pieces.forEach(({ group }) => group.children.forEach((c) => (c as InstanceType<typeof THREE.Mesh>).geometry.dispose()));
        [dark, lime, edgeLime, edgeInk].forEach((m) => m.dispose());
        bin.geometry.dispose();
        renderer.dispose();
      };
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`block ${className}`} />;
}
