// @ts-nocheck
"use client";

import { useEffect } from "react";
import * as THREE from "three";

/**
 * AnimatedFavicon
 * Renders a high-quality 3D flying rocket to an off-screen Three.js canvas
 * and updates the page's <link rel="icon"> at ~12fps for an animated tab icon.
 * The rocket tilts 45° (classic flying pose), floats gently, has a flickering
 * flame exhaust, glowing porthole, 3 fins, and star-field background.
 */
export function AnimatedFavicon() {
  useEffect(() => {
    const SIZE = 64;

    // ── Off-screen renderer ────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true, // toDataURL requires this
    });
    renderer.setSize(SIZE, SIZE);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x0f172a, 1); // dark slate background

    // ── Scene / Camera ─────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 5.2;

    // ── Gear shape via THREE.Shape ─────────────────────────────────────────
    const TEETH = 9;
    const INNER_R = 0.74;
    const OUTER_R = 1.0;
    const TOOTH_H = 0.3;
    const HOLE_R = 0.26;
    const TWO_PI = Math.PI * 2;
    const STEP = TWO_PI / TEETH;
    const HALF_STEP = STEP * 0.2;

    const shape = new THREE.Shape();
    for (let i = 0; i < TEETH; i++) {
      const a = (i / TEETH) * TWO_PI - Math.PI / 2;
      const a1 = a - HALF_STEP;
      const a2 = a + HALF_STEP;
      const orr = OUTER_R + TOOTH_H;

      if (i === 0) shape.moveTo(Math.cos(a1) * INNER_R, Math.sin(a1) * INNER_R);
      else shape.lineTo(Math.cos(a1) * INNER_R, Math.sin(a1) * INNER_R);

      shape.lineTo(Math.cos(a1) * orr, Math.sin(a1) * orr);
      shape.lineTo(Math.cos(a2) * orr, Math.sin(a2) * orr);
      shape.lineTo(Math.cos(a2) * INNER_R, Math.sin(a2) * INNER_R);

      const nextA1 = ((i + 1) / TEETH) * TWO_PI - Math.PI / 2 - HALF_STEP;
      shape.absarc(0, 0, INNER_R, a2, nextA1, false);
    }
    shape.closePath();

    // Centre hole
    const hole = new THREE.Path();
    hole.absarc(0, 0, HOLE_R, 0, TWO_PI, true);
    shape.holes.push(hole);

    const extrudeSettings = {
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.05,
      bevelSegments: 3,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center();

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.55,
      metalness: 0.92,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // ── Lighting ───────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    const keyLight = new THREE.PointLight(0x38bdf8, 5, 30);
    keyLight.position.set(3, 3, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xd946ef, 2.5, 20);
    fillLight.position.set(-3, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xfbbf24, 1.5, 15);
    rimLight.position.set(0, -3, 2);
    scene.add(rimLight);

    // ── Favicon link reference ────────────────────────────────────────────
    // Prefer the existing <link rel="icon"> so we don't add a duplicate
    let link = document.querySelector(
      "link[rel~='icon']",
    ) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      document.head.appendChild(link);
    }

    // ── Animation loop ────────────────────────────────────────────────────
    // Render Three.js at RAF speed (smooth), but update favicon at ~12fps
    // to keep CPU overhead low (toDataURL is expensive every frame).
    let lastUpdate = 0;
    const FAVICON_INTERVAL = 83; // ms ≈ 12fps
    let rafId: number;

    const animate = (time: number) => {
      rafId = requestAnimationFrame(animate);

      // Slow, smooth continuous rotation
      mesh.rotation.z = time * 0.0008;
      // Slight wobble on X/Y for depth feel
      mesh.rotation.x = Math.sin(time * 0.0004) * 0.15;
      mesh.rotation.y = Math.cos(time * 0.0003) * 0.12;

      renderer.render(scene, camera);

      // Throttle favicon update
      if (time - lastUpdate > FAVICON_INTERVAL) {
        lastUpdate = time;
        try {
          const dataUrl = renderer.domElement.toDataURL("image/png");
          if (link) {
            link.href = dataUrl;
            link.type = "image/png";
          }
        } catch {
          // toDataURL can throw if context is lost
        }
      }
    };

    rafId = requestAnimationFrame(animate);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return null;
}
