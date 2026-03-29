"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function gearPoly(teeth: number, outerR: number, innerR: number): string {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i * Math.PI) / teeth - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(
      `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`,
    );
  }
  return pts.join(" ");
}

const mainGear = gearPoly(16, 48, 40);
const innerGear = gearPoly(8, 44, 34);
const spokes = [0, 45, 90, 135];

export function FloatingGear() {
  const gearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const gear = gearRef.current;
    if (!gear) return;

    // Idle continuous rotations
    const mainSpin = gsap.to(gear.querySelector(".fg-main"), {
      rotation: 360,
      duration: 22,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center",
    });
    const innerSpin = gsap.to(gear.querySelector(".fg-inner"), {
      rotation: -360,
      duration: 13,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center",
    });
    const orbitSpin = gsap.to(gear.querySelector(".fg-orbit"), {
      rotation: 360,
      duration: 55,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center",
    });

    // Entrance animation
    gsap.fromTo(
      gear,
      { opacity: 0, scale: 0.55 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        delay: 0.65,
        ease: "elastic.out(1, 0.55)",
      },
    );

    // Scroll-velocity spin boost
    const velocityST = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const v = self.getVelocity();
        if (Math.abs(v) > 50) {
          const mainEl = gear.querySelector(".fg-main");
          const innerEl = gear.querySelector(".fg-inner");
          if (mainEl) {
            gsap.to(mainEl, {
              rotation: `+=${v * 0.015}`,
              duration: 0.6,
              ease: "power2.out",
              overwrite: false,
              transformOrigin: "center center",
            });
          }
          if (innerEl) {
            gsap.to(innerEl, {
              rotation: `-=${v * 0.01}`,
              duration: 0.6,
              ease: "power2.out",
              overwrite: false,
              transformOrigin: "center center",
            });
          }
        }
      },
    });

    return () => {
      mainSpin.kill();
      innerSpin.kill();
      orbitSpin.kill();
      velocityST.kill();
    };
  }, []);

  return (
    <div
      ref={gearRef}
      className="fixed top-[calc(50%-150px)] right-[5vw] z-50 pointer-events-none hidden lg:block"
      style={{ width: "300px", height: "300px", willChange: "transform" }}
    >
      {/* Dashed orbit ring */}
      <div
        className="fg-orbit absolute inset-0 rounded-full"
        style={{ border: "1px dashed rgba(14,165,233,0.09)" }}
      />

      {/* Orbit dots */}
      {[0, 90, 180, 270].map((deg) => (
        <div
          key={deg}
          className="absolute w-1 h-1 rounded-full bg-sky-500/25"
          style={{
            top: "50%",
            left: "50%",
            transform: `rotate(${deg}deg) translateY(-100px) translate(-50%, -50%)`,
          }}
        />
      ))}

      {/* Main gear SVG */}
      <svg
        className="fg-main absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        style={{
          filter:
            "drop-shadow(0 0 28px rgba(14,165,233,0.2)) drop-shadow(0 0 8px rgba(14,165,233,0.1))",
        }}
      >
        <polygon
          points={mainGear}
          fill="rgba(14,165,233,0.09)"
          stroke="rgba(14,165,233,0.38)"
          strokeWidth="0.55"
          strokeLinejoin="round"
        />
        {spokes.map((deg, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={(50 + 30 * Math.cos((deg * Math.PI) / 180)).toFixed(2)}
            y2={(50 + 30 * Math.sin((deg * Math.PI) / 180)).toFixed(2)}
            stroke="rgba(14,165,233,0.13)"
            strokeWidth="0.4"
          />
        ))}
        <circle
          cx="50"
          cy="50"
          r="16"
          fill="#080d1a"
          stroke="rgba(14,165,233,0.28)"
          strokeWidth="0.5"
        />
      </svg>

      {/* Inner counter-rotating gear */}
      <svg
        className="fg-inner absolute w-[45px] h-[45px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 100 100"
        style={{
          filter: "drop-shadow(0 0 12px rgba(217,70,239,0.22))",
        }}
      >
        <polygon
          points={innerGear}
          fill="rgba(217,70,239,0.1)"
          stroke="rgba(217,70,239,0.38)"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        <circle
          cx="50"
          cy="50"
          r="20"
          fill="#080d1a"
          stroke="rgba(217,70,239,0.25)"
          strokeWidth="0.6"
        />
      </svg>

      {/* Center dot */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-10 shadow-lg shadow-sky-500/50"
        style={{
          background: "linear-gradient(135deg, #38bdf8, #d946ef)",
        }}
      />
    </div>
  );
}
