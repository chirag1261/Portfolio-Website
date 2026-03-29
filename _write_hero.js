const fs = require("fs");
const path = require("path");

const hero = `"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const roleLines = ["Full Stack", "Developer"];

function gearPoly(teeth: number, outerR: number, innerR: number): string {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i * Math.PI) / teeth - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(
      \`\${(50 + r * Math.cos(a)).toFixed(2)},\${(50 + r * Math.sin(a)).toFixed(2)}\`
    );
  }
  return pts.join(" ");
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Continuous gear rotations
      gsap.to(".gear-main", {
        rotation: 360,
        duration: 22,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });
      gsap.to(".gear-inner", {
        rotation: -360,
        duration: 13,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });
      gsap.to(".gear-orbit-ring", {
        rotation: 360,
        duration: 55,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });

      // Entrance timeline
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(".hero-index", {
        opacity: 0,
        scale: 1.4,
        duration: 1.2,
        ease: "power4.out",
      })
        .from(
          ".hero-badge",
          { opacity: 0, y: 28, duration: 0.6, ease: "power3.out" },
          "-=0.7"
        )
        .from(
          ".hero-name-first .hero-letter",
          {
            y: 110,
            opacity: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power4.out",
          },
          "-=0.35"
        )
        .from(
          ".hero-name-last .hero-letter",
          {
            y: 110,
            opacity: 0,
            duration: 1,
            stagger: 0.05,
            ease: "power4.out",
          },
          "-=0.75"
        )
        .from(
          ".hero-role-char",
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.025,
            ease: "back.out(1.5)",
          },
          "-=0.5"
        )
        .from(
          ".hero-desc",
          { opacity: 0, y: 24, duration: 0.6, ease: "power3.out" },
          "-=0.2"
        )
        .from(
          ".hero-cta",
          {
            opacity: 0,
            y: 18,
            duration: 0.4,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .from(
          ".hero-stat",
          {
            opacity: 0,
            y: 16,
            duration: 0.35,
            stagger: 0.07,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .from(
          ".gear-wrapper",
          {
            opacity: 0,
            scale: 0.55,
            rotation: -60,
            duration: 1.4,
            ease: "elastic.out(1, 0.55)",
          },
          0.5
        );

      // Scroll scrub parallax
      gsap.to(".hero-left", {
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.8,
        },
      });
      gsap.to(".gear-wrapper", {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2.8,
        },
      });
      gsap.to(".hero-grid-bg", {
        y: 80,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Fade on scroll
      gsap.to(".hero-scroll-fade", {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "30% top",
          end: "65% top",
          scrub: 1,
        },
      });

      // Gear scroll-velocity spin boost
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          if (Math.abs(v) > 10) {
            gsap.to(".gear-main", {
              rotation: "+=" + v * 0.012,
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto",
              transformOrigin: "center center",
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const mainGear = gearPoly(16, 48, 40);
  const innerGear = gearPoly(8, 44, 34);
  const spokes = [0, 45, 90, 135];

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-[#080d1a]"
    >
      {/* Grid bg */}
      <div
        className="hero-grid-bg absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(14,165,233,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute -top-56 -left-56 w-[700px] h-[700px] bg-sky-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* Ghost index */}
      <span className="hero-index absolute top-0 right-4 font-black text-[22vw] leading-none text-white/[0.02] select-none pointer-events-none">
        01
      </span>

      {/* Main layout */}
      <div className="hero-scroll-fade relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-28">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          {/* LEFT */}
          <div className="hero-left flex-1 max-w-[640px] space-y-7">
            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.035] backdrop-blur-sm w-fit">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm text-slate-400 font-mono tracking-wide">
                Available for opportunities
              </span>
            </div>

            {/* Name */}
            <div>
              <div className="hero-name-first overflow-hidden leading-[0.9]">
                <div className="font-display text-[clamp(3.5rem,8vw,6.5rem)] font-black text-white tracking-tight">
                  {"Chirag".split("").map((ch, i) => (
                    <span key={i} className="hero-letter inline-block">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hero-name-last overflow-hidden leading-[0.9]">
                <div
                  className="font-display text-[clamp(3.5rem,8vw,6.5rem)] font-black tracking-tight"
                  style={{
                    background:
                      "linear-gradient(90deg, #38bdf8 0%, #a855f7 55%, #ec4899 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {"Kumar".split("").map((ch, i) => (
                    <span key={i} className="hero-letter inline-block">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-0.5">
              {roleLines.map((line) => (
                <div key={line} className="overflow-hidden">
                  <p className="font-display text-[clamp(1.3rem,3vw,1.9rem)] font-bold tracking-[0.18em] text-sky-400/60">
                    {line.split("").map((ch, ci) => (
                      <span key={ci} className="hero-role-char inline-block">
                        {ch === " " ? "\\u00A0" : ch}
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>

            {/* Desc */}
            <p className="hero-desc text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg">
              Building scalable systems &amp; gamification features impacting{" "}
              <span className="text-sky-400 font-semibold">800K+ users</span>{" "}
              at{" "}
              <span className="text-fuchsia-400 font-semibold">
                Junglee Games
              </span>
              . Passionate about clean code &amp; performance optimization.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollTo("#projects")}
                className="hero-cta btn btn-primary px-7 py-3.5 text-sm font-semibold"
              >
                View Projects
              </button>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-slate-300 border border-white/15 rounded-lg hover:bg-white/5 hover:text-white transition-all"
              >
                Resume
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-5 border-t border-white/5">
              {[
                { value: "2+", label: "Years Exp." },
                { value: "800K+", label: "Users Impacted" },
                { value: "15+", label: "Projects" },
                { value: "20+", label: "Technologies" },
              ].map((s) => (
                <div key={s.label} className="hero-stat">
                  <p
                    className="text-3xl font-black tabular-nums"
                    style={{
                      background:
                        "linear-gradient(135deg, #38bdf8, #d946ef)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {s.value}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5 uppercase tracking-[0.18em]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Spinning Gear */}
          <div className="gear-wrapper hidden lg:flex flex-col items-center justify-center relative flex-shrink-0 w-[340px] h-[340px]">
            {/* Outer orbit ring */}
            <div className="absolute inset-[-24px] rounded-full border border-sky-500/[0.07]" />
            {/* Dashed orbit ring */}
            <div
              className="gear-orbit-ring absolute inset-0 rounded-full"
              style={{ border: "1px dashed rgba(14,165,233,0.09)" }}
            />

            {/* Orbit dots */}
            {[0, 90, 180, 270].map((deg) => (
              <div
                key={deg}
                className="absolute w-1.5 h-1.5 rounded-full bg-sky-500/25"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: \`rotate(\${deg}deg) translateY(-193px) translate(-50%, -50%)\`,
                }}
              />
            ))}

            {/* Main gear SVG */}
            <svg
              className="gear-main absolute inset-0 w-full h-full"
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
              className="gear-inner absolute w-[76px] h-[76px]"
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
              className="absolute w-3 h-3 rounded-full z-10 shadow-lg shadow-sky-500/50"
              style={{
                background: "linear-gradient(135deg, #38bdf8, #d946ef)",
              }}
            />

            {/* Tech label */}
            <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-sky-400/30 tracking-[0.32em] uppercase">
              Node · React · Next · AWS
            </div>

            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-sky-500/15" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-sky-500/15" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-sky-500/15" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-sky-500/15" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] text-slate-600 tracking-[0.4em] uppercase">
          Scroll
        </span>
        <div
          className="w-px h-12 rounded-full animate-pulse"
          style={{
            background:
              "linear-gradient(to bottom, rgba(14,165,233,0.5), transparent)",
          }}
        />
      </div>
    </section>
  );
}
`;

fs.writeFileSync(
  path.join(__dirname, "src/components/sections/Hero.tsx"),
  hero,
);
console.log(
  "Hero written successfully: " + hero.split("\\n").length + " lines",
);
