// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function PageLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // Three.js scene setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x080d1a, 1);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 3);

    // ── Particle field ────────────────────────────────────
    const PARTICLE_COUNT = 3000;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    const colorA = new THREE.Color("#0ea5e9");
    const colorB = new THREE.Color("#d946ef");
    const colorC = new THREE.Color("#a855f7");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 6;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const t = Math.random();
      const col = t < 0.4 ? colorA : t < 0.7 ? colorB : colorC;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Central morphing icosahedron ──────────────────────
    const icoGeo = new THREE.IcosahedronGeometry(0.45, 1);
    const icoMat = new THREE.MeshPhysicalMaterial({
      color: "#0c2d4a",
      metalness: 0.9,
      roughness: 0.05,
      emissive: "#0ea5e9",
      emissiveIntensity: 0.4,
      wireframe: false,
      transparent: true,
      opacity: 0.9,
    });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    // ── Wireframe overlay ─────────────────────────────────
    const wireGeo = new THREE.IcosahedronGeometry(0.47, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: "#38bdf8",
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    // ── Orbit rings ───────────────────────────────────────
    const ring1Geo = new THREE.TorusGeometry(0.75, 0.004, 8, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: "#0ea5e9",
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(0.9, 0.003, 8, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: "#d946ef",
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 5;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // ── Orbiting dots ─────────────────────────────────────
    const dotGeos: THREE.Mesh[] = [];
    const dotColors = ["#38bdf8", "#d946ef", "#a855f7"];
    for (let d = 0; d < 3; d++) {
      const dg = new THREE.SphereGeometry(0.025, 8, 8);
      const dm = new THREE.MeshBasicMaterial({
        color: dotColors[d],
        transparent: true,
        opacity: 0.9,
      });
      const dot = new THREE.Mesh(dg, dm);
      dotGeos.push(dot);
      scene.add(dot);
    }

    // ── Lights ────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const pointLight1 = new THREE.PointLight(0x0ea5e9, 2, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0xd946ef, 1.5, 10);
    pointLight2.position.set(-2, -1, 1);
    scene.add(pointLight2);

    // ── Handle resize ─────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────
    let t = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.012;

      // Rotate icosahedron
      ico.rotation.x = t * 0.4;
      ico.rotation.y = t * 0.6;
      wire.rotation.x = t * 0.4;
      wire.rotation.y = t * 0.6;

      // Pulse scale
      const pulse = 1 + Math.sin(t * 2) * 0.06;
      ico.scale.setScalar(pulse);
      wire.scale.setScalar(pulse * 1.02);

      // Rotate rings
      ring1.rotation.z = t * 0.5;
      ring2.rotation.z = -t * 0.35;

      // Orbiting dots
      dotGeos.forEach((dot, i) => {
        const angle = t * (0.8 + i * 0.3) + (i * Math.PI * 2) / 3;
        const radius = 0.82 + i * 0.08;
        dot.position.x = radius * Math.cos(angle);
        dot.position.y = radius * Math.sin(angle) * 0.5;
        dot.position.z = radius * Math.sin(angle) * 0.5;
      });

      // Slowly rotate particle cloud
      particles.rotation.y = t * 0.04;
      particles.rotation.x = Math.sin(t * 0.02) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    // ── Dismiss when page is ready ────────────────────────
    const dismiss = () => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 700);
    };

    if (document.readyState === "complete") {
      // Already loaded — brief delay so animation is shown
      setTimeout(dismiss, 800);
    } else {
      window.addEventListener("load", () => setTimeout(dismiss, 300), {
        once: true,
      });
      // Safety fallback — never block beyond 5s
      setTimeout(dismiss, 5000);
    }

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "#080d1a",
        transition: "opacity 0.7s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Three.js canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Overlay text */}
      <div
        className="relative z-10 flex flex-col items-center gap-3 pointer-events-none"
        style={{ opacity: fadeOut ? 0 : 1, transition: "opacity 0.5s ease" }}
      >
        <div
          className="font-mono text-[11px] tracking-[0.35em] uppercase text-white/40 mt-48"
          style={{ letterSpacing: "0.35em" }}
        >
          Loading
        </div>
        {/* Animated dots */}
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-sky-400"
              style={{
                animation: `loader-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes loader-dot {
          0%,
          80%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
