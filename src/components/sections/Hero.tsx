"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [countersReady, setCountersReady] = useState(false);

  // Smooth custom cursor
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        x: x - 24,
        y: y - 24,
        duration: 0.6,
        ease: "power3.out",
      });
    }
    if (cursorDotRef.current) {
      gsap.to(cursorDotRef.current, {
        x: x - 4,
        y: y - 4,
        duration: 0.15,
        ease: "power2.out",
      });
    }

    // Magnetic effect on name letters
    if (nameRef.current) {
      const letters = nameRef.current.querySelectorAll(".magnetic-letter");
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = x - centerX;
        const distY = y - centerY;
        const dist = Math.sqrt(distX * distX + distY * distY);
        const maxDist = 200;

        if (dist < maxDist) {
          const strength = (1 - dist / maxDist) * 12;
          gsap.to(letter, {
            x: (distX / dist) * strength,
            y: (distY / dist) * strength,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(letter, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
          });
        }
      });
    }
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    window.addEventListener("mousemove", handleMouseMove);

    const ctx = gsap.context(() => {
      // Master timeline — cinematic entrance
      const master = gsap.timeline({ delay: 0.3 });

      // Phase 1: Overlay wipe (split curtain)
      master.to(".hero-overlay-left", {
        xPercent: -101,
        duration: 1.2,
        ease: "power4.inOut",
      });
      master.to(
        ".hero-overlay-right",
        { xPercent: 101, duration: 1.2, ease: "power4.inOut" },
        "<",
      );

      // Phase 2: Vertical lines sweep in
      master.from(
        ".hero-vline",
        {
          scaleY: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "power3.inOut",
        },
        "-=0.5",
      );

      // Phase 3: Horizontal divider draws
      master.fromTo(
        ".hero-divider",
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: "power3.inOut" },
        "-=0.8",
      );

      // Phase 4: Name text reveal — masked slide up with rotation
      master.from(
        ".hero-first .char-mask",
        {
          yPercent: 120,
          rotateZ: 8,
          duration: 1.2,
          stagger: 0.05,
          ease: "power4.out",
        },
        "-=0.6",
      );
      master.from(
        ".hero-last .char-mask",
        {
          yPercent: 120,
          rotateZ: -6,
          duration: 1.2,
          stagger: 0.05,
          ease: "power4.out",
        },
        "-=0.9",
      );

      // Phase 5: Role text — fast stagger
      master.from(
        ".hero-role .role-char",
        {
          opacity: 0,
          y: 20,
          rotateX: -90,
          duration: 0.5,
          stagger: 0.015,
          ease: "back.out(2)",
        },
        "-=0.8",
      );

      // Phase 6: Badge slides in
      master.from(
        ".hero-badge-wrap",
        {
          opacity: 0,
          x: -40,
          filter: "blur(10px)",
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.5",
      );

      // Phase 7: Description
      master.from(
        ".hero-desc",
        { opacity: 0, y: 25, duration: 0.7, ease: "power3.out" },
        "-=0.3",
      );

      // Phase 8: CTAs with scale bounce
      master.from(
        ".hero-cta",
        {
          opacity: 0,
          y: 20,
          scale: 0.8,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.7)",
        },
        "-=0.2",
      );

      // Phase 9: Stats counter animation
      master.add(() => setCountersReady(true), "-=0.3");
      master.from(
        ".hero-stat",
        {
          opacity: 0,
          y: 20,
          scale: 0.85,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.3",
      );

      // Phase 10: Corner + scroll cue
      master.from(
        ".hero-corner",
        { opacity: 0, duration: 0.5, ease: "power2.out" },
        "-=0.2",
      );
      master.from(
        ".hero-scroll-cue",
        { opacity: 0, y: 15, duration: 0.6, ease: "power2.out" },
        "-=0.1",
      );

      // ── Scroll-driven parallax ──
      gsap.to(".hero-name-block", {
        yPercent: -25,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });

      gsap.to(".hero-meta-block", {
        yPercent: 15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(".hero-vline", {
        scaleY: 0.3,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "20% top",
          end: "70% top",
          scrub: 1,
        },
      });

      // Fade on scroll
      gsap.to(".hero-fade-wrap", {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "25% top",
          end: "60% top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative z-10 min-h-screen flex items-center overflow-hidden bg-[#080d1a]/80"
    >
      {/* ── Opening wipe overlays ── */}
      <div className="hero-overlay-left fixed inset-0 z-50 bg-[#0a0f1e] pointer-events-none" />
      <div className="hero-overlay-right fixed inset-0 z-50 bg-[#0ea5e9] pointer-events-none" />

      {/* ── Custom cursor (desktop) ── */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-12 h-12 rounded-full border border-white/20 pointer-events-none z-[60] mix-blend-difference hidden lg:block"
        style={{ willChange: "transform" }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[61] mix-blend-difference hidden lg:block"
        style={{ willChange: "transform" }}
      />

      {/* ── Decorative vertical lines ── */}
      <div className="absolute inset-0 pointer-events-none z-[1] flex justify-between px-[8%]">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="hero-vline w-px h-full origin-top"
            style={{
              background: `linear-gradient(180deg, transparent 0%, rgba(14,165,233,${0.06 - i * 0.008}) 30%, rgba(217,70,239,${0.04 - i * 0.005}) 70%, transparent 100%)`,
            }}
          />
        ))}
      </div>

      {/* ── Grid bg ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Glow accents ── */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-sky-500/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-500/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="hero-glow-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500/[0.02] rounded-full blur-[200px] pointer-events-none" />

      {/* ── Main content ── */}
      <div className="hero-fade-wrap relative z-10 w-full">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-20">
          {/* Badge */}
          <div className="hero-badge-wrap mb-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/10 bg-white/[0.035] backdrop-blur-sm">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm text-slate-400 font-mono tracking-wide">
                Available for opportunities
              </span>
            </div>
          </div>

          {/* ── Name block (cinematic masked reveal + magnetic) ── */}
          <div ref={nameRef} className="hero-name-block relative mb-6">
            {/* CHIRAG */}
            <div className="hero-first overflow-hidden">
              <div className="flex">
                {"CHIRAG".split("").map((ch, i) => (
                  <span
                    key={i}
                    className="char-mask magnetic-letter inline-block font-display text-[clamp(4rem,12vw,9rem)] font-black text-white leading-[0.9] tracking-[-0.03em] will-change-transform"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>

            {/* Horizontal divider (animated line-draw) */}
            <div className="hero-divider origin-left h-px w-full bg-gradient-to-r from-sky-500/60 via-fuchsia-500/40 to-transparent my-3" />

            {/* KUMAR */}
            <div className="hero-last overflow-hidden">
              <div className="flex">
                {"KUMAR".split("").map((ch, i) => (
                  <span
                    key={i}
                    className="char-mask magnetic-letter inline-block font-display text-[clamp(4rem,12vw,9rem)] font-black leading-[0.9] tracking-[-0.03em] will-change-transform"
                    style={{
                      background:
                        "linear-gradient(90deg, #38bdf8 0%, #a855f7 55%, #ec4899 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Role line ── */}
          <div className="hero-role mb-8">
            <p className="font-display text-[clamp(1.1rem,2.5vw,1.6rem)] font-semibold tracking-[0.2em] text-sky-400/50 uppercase">
              {"Full Stack Developer".split("").map((ch, ci) => (
                <span
                  key={ci}
                  className="role-char inline-block"
                  style={{ transformOrigin: "bottom center" }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </p>
          </div>

          {/* ── Meta block: desc + CTAs + stats ── */}
          <div className="hero-meta-block max-w-2xl space-y-7">
            {/* Description */}
            <p className="hero-desc text-slate-400 text-base sm:text-lg leading-relaxed">
              Building scalable systems &amp; gamification features impacting{" "}
              <span className="text-sky-400 font-semibold">800K+ users</span> at{" "}
              <span className="text-fuchsia-400 font-semibold">
                Junglee Games
              </span>
              . Passionate about clean code &amp; performance optimization.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollTo("#projects")}
                className="hero-cta group relative px-8 py-3.5 text-sm font-semibold text-white overflow-hidden rounded-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-sky-500 to-fuchsia-500 transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-fuchsia-500 to-sky-500" />
                <span className="relative z-10">View Projects</span>
              </button>
              <a
                href="/resume-pdf/Chirag's Resume.pdf"
                download
                className="hero-cta group inline-flex items-center gap-2.5 px-8 py-3.5 text-sm font-semibold text-slate-300 border border-white/15 rounded-lg hover:border-sky-500/40 hover:text-white transition-all duration-300 overflow-hidden relative"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-fuchsia-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10">Download Resume</span>
                <svg
                  className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5"
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

            {/* Stats row with animated counters */}
            <div className="flex flex-wrap gap-10 pt-6 border-t border-white/5">
              {[
                { value: 2, suffix: "+", label: "Years Exp." },
                { value: 800, suffix: "K+", label: "Users Impacted" },
                { value: 15, suffix: "+", label: "Projects" },
                { value: 20, suffix: "+", label: "Technologies" },
              ].map((s) => (
                <div key={s.label} className="hero-stat">
                  <p
                    className="text-3xl font-black tabular-nums"
                    style={{
                      background: "linear-gradient(135deg, #38bdf8, #d946ef)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    <AnimatedCounter
                      target={s.value}
                      suffix={s.suffix}
                      active={countersReady}
                    />
                  </p>
                  <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-[0.22em] font-mono">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="hero-scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] text-slate-600 tracking-[0.4em] uppercase">
          Scroll
        </span>
        <div className="relative w-5 h-8 border border-white/15 rounded-full flex justify-center">
          <div
            className="w-0.5 h-2 bg-sky-400/60 rounded-full mt-1.5"
            style={{ animation: "scrollPulse 2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}

// ── Animated counter component ──
function AnimatedCounter({
  target,
  suffix,
  active,
}: {
  target: number;
  suffix: string;
  active: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!active || animated.current || !ref.current) return;
    animated.current = true;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(obj.val) + suffix;
        }
      },
    });
  }, [active, target, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}
