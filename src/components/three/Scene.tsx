// @ts-nocheck
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Points,
  PointMaterial,
  Float,
  Trail,
  MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Helpers ───────────────────────────────────────────────
function generateSpherePoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function generateRingPoints(
  count: number,
  radius: number,
  spread: number,
): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const r = radius + (Math.random() - 0.5) * spread;
    positions[i * 3] = r * Math.cos(angle);
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.4;
    positions[i * 3 + 2] = r * Math.sin(angle);
  }
  return positions;
}

// ─── Shared state ──────────────────────────────────────────
const scrollState = { progress: 0, velocity: 0 };
const mouse3D = new THREE.Vector3(0, 0, 0);

function ScrollTracker() {
  useFrame(() => {
    if (typeof window === "undefined") return;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const raw = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    const newProgress = Math.min(Math.max(raw, 0), 1);
    scrollState.velocity = (newProgress - scrollState.progress) * 60;
    scrollState.progress = newProgress;
  });
  return null;
}

// Unproject mouse into 3D world at z=0 plane
function MouseTracker() {
  const { camera, size } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    [],
  );
  const intersection = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    raycaster.setFromCamera(state.mouse, camera);
    raycaster.ray.intersectPlane(plane, intersection);
    mouse3D.lerp(intersection, 0.1);
  });
  return null;
}

// ─── Attracting particle field ─────────────────────────────
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const basePositions = useMemo(() => generateSpherePoints(6000, 2), []);
  const positions = useMemo(
    () => new Float32Array(basePositions),
    [basePositions],
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    const geo = ref.current.geometry;
    const posAttr = geo.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < arr.length / 3; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Current world-ish position (accounting for group rotation is complex,
      // so we attract in local space toward an approximation)
      const bx = basePositions[ix];
      const by = basePositions[iy];
      const bz = basePositions[iz];

      // Direction toward mouse (in local space we approximate)
      const dx = mouse3D.x * 0.8 - arr[ix];
      const dy = mouse3D.y * 0.8 - arr[iy];
      const dz = 0 - arr[iz];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Attraction strength – stronger when closer
      const attractRange = 1.5;
      const attract =
        dist < attractRange ? (1 - dist / attractRange) * 0.08 : 0;

      // Lerp toward mouse when in range, otherwise drift back to base
      arr[ix] += (bx - arr[ix]) * 0.02 + dx * attract;
      arr[iy] += (by - arr[iy]) * 0.02 + dy * attract;
      arr[iz] += (bz - arr[iz]) * 0.02 + dz * attract;
    }
    posAttr.needsUpdate = true;

    // Base rotation
    ref.current.rotation.x -= delta / 25;
    ref.current.rotation.y -= delta / 30;
    // Scroll-reactive expansion
    const s = 1 + scrollState.progress * 0.6;
    ref.current.scale.set(s, s, s);
    ref.current.rotation.z += scrollState.velocity * 0.02;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#0ea5e9"
          size={0.003}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

// ─── Attracting accent particles ────────────────────────────
function AccentParticles() {
  const ref = useRef<THREE.Points>(null);
  const basePositions = useMemo(() => generateSpherePoints(2500, 2.2), []);
  const positions = useMemo(
    () => new Float32Array(basePositions),
    [basePositions],
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < arr.length / 3; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const bx = basePositions[ix];
      const by = basePositions[iy];
      const bz = basePositions[iz];

      const dx = mouse3D.x * 0.7 - arr[ix];
      const dy = mouse3D.y * 0.7 - arr[iy];
      const dist = Math.sqrt(dx * dx + dy * dy);

      const attractRange = 1.2;
      const attract =
        dist < attractRange ? (1 - dist / attractRange) * 0.06 : 0;

      arr[ix] += (bx - arr[ix]) * 0.015 + dx * attract;
      arr[iy] += (by - arr[iy]) * 0.015 + dy * attract;
      arr[iz] += (bz - arr[iz]) * 0.015;
    }
    posAttr.needsUpdate = true;

    ref.current.rotation.x += delta / 30;
    ref.current.rotation.y += delta / 35;
    ref.current.position.x = Math.sin(scrollState.progress * Math.PI * 2) * 0.3;
    ref.current.position.z = Math.cos(scrollState.progress * Math.PI * 2) * 0.3;
  });

  return (
    <group rotation={[0, 0, -Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#d946ef"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.5}
        />
      </Points>
    </group>
  );
}

// ─── Orbital ring particles (mouse-attracted) ───────────────
function OrbitalRing({
  radius,
  count,
  color,
  speed,
  tilt,
}: {
  radius: number;
  count: number;
  color: string;
  speed: number;
  tilt: [number, number, number];
}) {
  const ref = useRef<THREE.Points>(null);
  const basePositions = useMemo(
    () => generateRingPoints(count, radius, 0.15),
    [count, radius],
  );
  const positions = useMemo(
    () => new Float32Array(basePositions),
    [basePositions],
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < arr.length / 3; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;

      const dx = mouse3D.x * 0.5 - arr[ix];
      const dy = mouse3D.y * 0.5 - arr[iy];
      const dist = Math.sqrt(dx * dx + dy * dy);
      const attract = dist < 1.0 ? (1 - dist / 1.0) * 0.04 : 0;

      arr[ix] += (basePositions[ix] - arr[ix]) * 0.02 + dx * attract;
      arr[iy] += (basePositions[iy] - arr[iy]) * 0.02 + dy * attract;
    }
    posAttr.needsUpdate = true;

    ref.current.rotation.y += delta * speed;
    ref.current.rotation.y += scrollState.velocity * 0.05;
  });

  return (
    <group rotation={tilt}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={0.004}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.7}
        />
      </Points>
    </group>
  );
}

// ─── Morphing Hero Sphere ────────────────────────────────────────
function HeroSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const basePositions = useRef<Float32Array | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const heroVis = Math.max(1 - scrollState.progress * 4, 0);

    // Morph vertices with organic noise displacement
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;
    if (!basePositions.current) {
      basePositions.current = new Float32Array(posAttr.array);
    }
    const base = basePositions.current;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < arr.length / 3; i++) {
      const bx = base[i * 3];
      const by = base[i * 3 + 1];
      const bz = base[i * 3 + 2];
      const len = Math.sqrt(bx * bx + by * by + bz * bz);
      if (len === 0) continue;
      const nx = bx / len;
      const ny = by / len;
      const nz = bz / len;

      const d1 = Math.sin(nx * 3.0 + t * 0.5) * Math.cos(ny * 3.0 + t * 0.3) * 0.15;
      const d2 = Math.sin(ny * 5.0 + t * 0.8) * Math.cos(nz * 4.0 + t * 0.6) * 0.08;
      const d3 = Math.cos(nz * 2.0 + t * 0.4) * Math.sin(nx * 6.0 + t * 0.7) * 0.05;
      const displacement = (d1 + d2 + d3) * heroVis;

      arr[i * 3] = bx + nx * displacement;
      arr[i * 3 + 1] = by + ny * displacement;
      arr[i * 3 + 2] = bz + nz * displacement;
    }
    posAttr.needsUpdate = true;

    meshRef.current.rotation.y = t * 0.08;
    meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.2;
    const s = heroVis * 1.0;
    meshRef.current.scale.setScalar(s);
    meshRef.current.position.x = 1.8 + (1 - heroVis) * 2;
    meshRef.current.position.y = 0.1 + Math.sin(t * 0.25) * 0.12;
    (meshRef.current.material as any).opacity = heroVis * 0.07;

    if (wireRef.current) {
      wireRef.current.rotation.copy(meshRef.current.rotation);
      wireRef.current.scale.copy(meshRef.current.scale);
      wireRef.current.position.copy(meshRef.current.position);
      (wireRef.current.material as any).opacity = heroVis * 0.12;
    }
    if (glowRef.current) {
      glowRef.current.position.copy(meshRef.current.position);
      const gs = heroVis * 1.8;
      glowRef.current.scale.setScalar(gs);
      (glowRef.current.material as any).opacity = heroVis * 0.03;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[1.8, 0.1, -1]}>
        <sphereGeometry args={[1.3, 64, 64]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wireRef} position={[1.8, 0.1, -1]}>
        <sphereGeometry args={[1.3, 28, 28]} />
        <meshBasicMaterial
          color="#a855f7"
          wireframe
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={glowRef} position={[1.8, 0.1, -1]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Thin orbiting rings around hero sphere ─────────────────
function HeroOrbitRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const heroVis = Math.max(1 - scrollState.progress * 4, 0);
    const baseX = 1.8 + (1 - heroVis) * 2;
    const baseY = 0.1 + Math.sin(t * 0.25) * 0.12;

    const rings = [
      { ref: ring1Ref, rx: t * 0.4, ry: t * 0.2, scale: 1.6 },
      { ref: ring2Ref, rx: t * 0.3, ry: t * 0.5 + Math.PI / 3, scale: 1.9 },
      { ref: ring3Ref, rx: t * 0.15, ry: t * 0.35 - Math.PI / 4, scale: 2.2 },
    ];

    rings.forEach((r, i) => {
      if (!r.ref.current) return;
      r.ref.current.rotation.x = r.rx;
      r.ref.current.rotation.y = r.ry;
      r.ref.current.position.set(baseX, baseY, -1);
      const s = heroVis * r.scale;
      r.ref.current.scale.setScalar(s);
      (r.ref.current.material as any).opacity = heroVis * (0.14 - i * 0.02);
    });
  });

  return (
    <>
      <mesh ref={ring1Ref} position={[1.8, 0.1, -1]}>
        <torusGeometry args={[1, 0.006, 16, 120]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref} position={[1.8, 0.1, -1]}>
        <torusGeometry args={[1, 0.005, 16, 120]} />
        <meshBasicMaterial color="#d946ef" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={ring3Ref} position={[1.8, 0.1, -1]}>
        <torusGeometry args={[1, 0.004, 16, 120]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </>
  );
}

// ─── Particle aurora wave ────────────────────────────────
function ParticleAurora() {
  const ref = useRef<THREE.Points>(null);
  const basePositions = useRef<Float32Array | null>(null);

  const positions = useMemo(() => {
    const count = 2000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      arr[i * 3 + 2] = -2 + Math.random() * 2;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const heroVis = Math.max(1 - scrollState.progress * 4, 0);
    const posAttr = ref.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    if (!basePositions.current) basePositions.current = new Float32Array(positions);
    const base = basePositions.current;

    for (let i = 0; i < arr.length / 3; i++) {
      const bx = base[i * 3];
      const bz = base[i * 3 + 2];
      arr[i * 3 + 1] =
        base[i * 3 + 1] +
        Math.sin(bx * 0.8 + t * 0.5) * 0.35 * heroVis +
        Math.cos(bz * 1.2 + t * 0.3) * 0.2 * heroVis;
      arr[i * 3] = base[i * 3] + Math.sin(t * 0.1 + i * 0.01) * 0.05;
    }
    posAttr.needsUpdate = true;
    ref.current.position.y = 1.3;
    (ref.current.material as any).opacity = heroVis * 0.45;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#38bdf8"
        size={0.007}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.45}
      />
    </Points>
  );
}

// ─── Flowing vertex wave mesh ───────────────────────────────
function VertexWavePlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const basePos = useRef<Float32Array | null>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;
    if (!basePos.current) basePos.current = new Float32Array(posAttr.array);
    const t = state.clock.elapsedTime;
    const arr = posAttr.array as Float32Array;
    const base = basePos.current;
    const heroVis = Math.max(1 - scrollState.progress * 4, 0);
    for (let i = 0; i < arr.length / 3; i++) {
      const bx = base[i * 3];
      const bz = base[i * 3 + 2];
      arr[i * 3 + 1] =
        base[i * 3 + 1] +
        Math.sin(bx * 1.2 + t * 0.6) * 0.25 * heroVis +
        Math.cos(bz * 1.0 + t * 0.4) * 0.18 * heroVis;
    }
    posAttr.needsUpdate = true;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = heroVis * 0.05;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -1.8, -2.5]}>
      <planeGeometry args={[14, 10, 56, 36]} />
      <meshBasicMaterial
        color="#0ea5e9"
        wireframe
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Mouse-following glow point ─────────────────────────────
function MouseGlow() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.lerp(mouse3D, 0.08);
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshBasicMaterial
        color="#0ea5e9"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ─── Floating wireframe icosahedron with trail ──────────────
function FloatingIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.3;
    meshRef.current.rotation.y += delta * 0.4;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    meshRef.current.position.x = 2 - scrollState.progress * 4;
    meshRef.current.position.z = -2 + scrollState.progress * 1;
    const pulse = 1 + Math.abs(scrollState.velocity) * 0.5;
    meshRef.current.scale.setScalar(0.3 * Math.min(pulse, 1.5));
  });

  return (
    <Trail
      width={1.5}
      length={6}
      color={new THREE.Color("#0ea5e9")}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} position={[2, 0, -2]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color="#0ea5e9"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </Trail>
  );
}

// ─── Distorted glass orb ────────────────────────────────────
function GlassOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    const mat = meshRef.current.material as any;
    if (mat.distort !== undefined) {
      mat.distort = 0.3 + scrollState.progress * 0.5;
    }
    const heroFade = Math.max(1 - scrollState.progress * 4, 0);
    meshRef.current.scale.setScalar(0.8 * heroFade + 0.2);
    meshRef.current.material.opacity = heroFade * 0.6;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={[1.2, 0.3, -0.5]}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <MeshDistortMaterial
          color="#0ea5e9"
          transparent
          opacity={0.6}
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.8}
          wireframe
        />
      </mesh>
    </Float>
  );
}

// ─── Floating torus knot ────────────────────────────────────
function FloatingTorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.z += delta * 0.1;
    meshRef.current.position.x = -2 + scrollState.progress * 3;
    meshRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.3 + 1) * 0.4;
    meshRef.current.position.z = -1.5 - scrollState.progress * 0.5;
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef} position={[-2, 0, -1.5]} scale={0.15}>
        <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 3]} />
        <meshBasicMaterial
          color="#d946ef"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </Float>
  );
}

// ─── Constellation lines ────────────────────────────────────
function ConstellationLines() {
  const lineRef = useRef<THREE.LineSegments>(null);

  const { positions, colors } = useMemo(() => {
    const nodeCount = 30;
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3 - 1,
        ),
      );
    }
    const segPoints: number[] = [];
    const segColors: number[] = [];
    const skyColor = new THREE.Color("#0ea5e9");
    const pinkColor = new THREE.Color("#ec4899");

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const d = nodes[i].distanceTo(nodes[j]);
        if (d < 1.2) {
          segPoints.push(nodes[i].x, nodes[i].y, nodes[i].z);
          segPoints.push(nodes[j].x, nodes[j].y, nodes[j].z);
          const c = d < 0.8 ? skyColor : pinkColor;
          segColors.push(c.r, c.g, c.b);
          segColors.push(c.r, c.g, c.b);
        }
      }
    }
    return {
      positions: new Float32Array(segPoints),
      colors: new Float32Array(segColors),
    };
  }, []);

  useFrame((state, delta) => {
    if (!lineRef.current) return;
    lineRef.current.rotation.y += delta * 0.03;
    lineRef.current.rotation.x += delta * 0.01;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.08 + scrollState.progress * 0.15;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [positions, colors]);

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

// ─── Floating grid plane ────────────────────────────────────
function GridFloor() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.z = -2 + scrollState.progress * 3;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.04 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2.5, 0, 0]} position={[0, -1.5, -1]}>
      <planeGeometry args={[12, 12, 24, 24]} />
      <meshBasicMaterial
        color="#0ea5e9"
        wireframe
        transparent
        opacity={0.04}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Floating cubes ─────────────────────────────────────────
function FloatingCubes() {
  const groupRef = useRef<THREE.Group>(null);

  const cubes = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3 - 1,
      ] as [number, number, number],
      scale: 0.03 + Math.random() * 0.06,
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      color: i % 2 === 0 ? "#0ea5e9" : "#d946ef",
    }));
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const cube = cubes[i];
      child.rotation.x += delta * cube.speed;
      child.rotation.y += delta * cube.speed * 0.7;
      child.position.y =
        cube.position[1] +
        Math.sin(state.clock.elapsedTime * 0.5 + cube.offset) * 0.3;
      child.position.x =
        cube.position[0] + scrollState.progress * (i % 2 === 0 ? 1 : -1) * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {cubes.map((cube, i) => (
        <mesh key={i} position={cube.position} scale={cube.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color={cube.color}
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Camera rig ─────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 1));

  useFrame((state) => {
    const mx = state.mouse.x * 0.15;
    const my = state.mouse.y * 0.1;
    const sz = 1 + scrollState.progress * 1.2;
    const sy = scrollState.progress * -0.3;

    target.current.set(mx, my + sy, sz);
    camera.position.lerp(target.current, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Compose scene ──────────────────────────────────────────
function Scene3D() {
  return (
    <>
      <ScrollTracker />
      <MouseTracker />
      <CameraRig />

      <ParticleField />
      <AccentParticles />
      <MouseGlow />

      <OrbitalRing
        radius={1.8}
        count={400}
        color="#0ea5e9"
        speed={0.15}
        tilt={[0.3, 0, 0]}
      />
      <OrbitalRing
        radius={2.2}
        count={300}
        color="#d946ef"
        speed={-0.1}
        tilt={[-0.5, 0.8, 0]}
      />
      <OrbitalRing
        radius={1.4}
        count={250}
        color="#ec4899"
        speed={0.2}
        tilt={[0.7, -0.3, 0.4]}
      />

      <HeroSphere />
      <HeroOrbitRings />
      <ParticleAurora />
      <VertexWavePlane />
      <FloatingIcosahedron />
      <GlassOrb />
      <FloatingTorusKnot />

      <ConstellationLines />
      <GridFloor />
      <FloatingCubes />

      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} intensity={0.5} color="#0ea5e9" />
      <pointLight position={[-3, -2, 2]} intensity={0.3} color="#d946ef" />
    </>
  );
}

export default function Scene() {
  return (
    <div className="three-canvas">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </Canvas>
    </div>
  );
}
