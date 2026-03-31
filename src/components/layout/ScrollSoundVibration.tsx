"use client";

import { useEffect, useRef } from "react";
import { useSound } from "@/components/providers/SoundContext";

// ── Soothing Scroll Sound ────────────────────────────────────────────────────
// Plays soft pentatonic bell/chime tones as you scroll.
// Notes are drawn from a C-major pentatonic scale (C5, E5, G5, A5, C6).
// Each note has a gentle sine attack + long decay that fades like a wind chime.
// A soft reverb-style delay is simulated with a second quieter echo.
//
// `wheel` events ARE user gestures → AudioContext unlocks on first scroll.

export function ScrollSoundVibration() {
  const { isMuted } = useSound();
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const ctxRef = useRef<AudioContext | null>(null);
  const reverbRef = useRef<ConvolverNode | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const pixelAccRef = useRef(0); // accumulated px since last note
  const noteIdxRef = useRef(0); // walk up/down the scale
  const dirRef = useRef(1); // +1 up scale, -1 down scale
  const lastScrollY = useRef(0);
  const rafRef = useRef(0);
  const velRef = useRef(0); // for idle fade

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    // ── C-major pentatonic scale, two octaves ────────────────────────────
    // C5 D5 E5 G5 A5 C6 E6 G6
    const NOTES = [
      523.25, 587.33, 659.25, 784.0, 880.0, 1046.5, 1318.51, 1567.98,
    ];
    const PX_PER_NOTE = 55; // pixels scrolled before a new note triggers

    // ── Build AudioContext immediately ────────────────────────────────────
    const AudioCtx = window.AudioContext ?? (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    // Master gain
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.55, ctx.currentTime);
    master.connect(ctx.destination);
    masterRef.current = master;

    // Simple impulse reverb (fake room tail) — 1.2 s white-noise decay
    const buildReverb = () => {
      const conv = ctx.createConvolver();
      const len = Math.floor(ctx.sampleRate * 1.2);
      const ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < len; i++)
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
      }
      conv.buffer = ir;
      conv.connect(master);
      return conv;
    };
    const reverb = buildReverb();
    reverbRef.current = reverb;

    // ── Play one soothing chime note ─────────────────────────────────────
    const playNote = (freq: number) => {
      if (!ctxRef.current || !masterRef.current) return;
      if (isMutedRef.current) return;
      if (ctxRef.current.state !== "running") return;

      const c = ctxRef.current;
      const now = c.currentTime;

      // Primary sine tone
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      // Slight detuned 2nd partial for warmth
      const osc2 = c.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2.005, now); // slightly detuned octave

      // Envelope: fast attack, long gentle decay (wind-chime character)
      const env = c.createGain();
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.32, now + 0.012); // soft attack
      env.gain.exponentialRampToValueAtTime(0.001, now + 1.6); // long tail

      // 2nd partial is quieter
      const env2 = c.createGain();
      env2.gain.setValueAtTime(0, now);
      env2.gain.linearRampToValueAtTime(0.1, now + 0.01);
      env2.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      // Gentle low-pass to keep it warm, not piercing
      const lpf = c.createBiquadFilter();
      lpf.type = "lowpass";
      lpf.frequency.setValueAtTime(3200, now);
      lpf.Q.setValueAtTime(0.7, now);

      osc.connect(env);
      osc2.connect(env2);
      env.connect(lpf);
      env2.connect(lpf);

      // Dry signal → master (quiet)
      const dryGain = c.createGain();
      dryGain.gain.setValueAtTime(0.55, now);
      lpf.connect(dryGain);
      dryGain.connect(masterRef.current);

      // Wet signal → reverb (spacious tail)
      const wetGain = c.createGain();
      wetGain.gain.setValueAtTime(0.45, now);
      lpf.connect(wetGain);
      if (reverbRef.current) wetGain.connect(reverbRef.current);

      osc.start(now);
      osc.stop(now + 1.8);
      osc2.start(now);
      osc2.stop(now + 1.2);
    };

    // ── Walk up/down the scale melodically ───────────────────────────────
    const nextNote = () => {
      const idx = noteIdxRef.current;
      playNote(NOTES[idx]);

      // Bounce at ends of scale
      const nextIdx = idx + dirRef.current;
      if (nextIdx >= NOTES.length) {
        dirRef.current = -1;
        noteIdxRef.current = NOTES.length - 2;
      } else if (nextIdx < 0) {
        dirRef.current = 1;
        noteIdxRef.current = 1;
      } else {
        noteIdxRef.current = nextIdx;
      }
    };

    // ── RAF loop — ambient velocity fade (no ticking needed) ─────────────
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      velRef.current *= 0.97;
    };

    // ── Wheel handler — real user gesture, unlocks AudioContext ──────────
    const onWheel = (e: WheelEvent) => {
      if (ctx.state === "suspended") ctx.resume().catch(() => {});

      const delta = Math.abs(e.deltaY) || Math.abs(e.deltaX);
      velRef.current = Math.min(60, velRef.current + delta * 0.2);

      // Accumulate pixels and fire a note when threshold is crossed
      pixelAccRef.current += delta;
      if (pixelAccRef.current >= PX_PER_NOTE) {
        pixelAccRef.current = 0;
        nextNote();
      }
    };

    // ── Scroll fallback (touch scroll / keyboard) ─────────────────────────
    const onScroll = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastScrollY.current);
      lastScrollY.current = y;
      if (ctx.state === "suspended") ctx.resume().catch(() => {});

      pixelAccRef.current += delta;
      if (pixelAccRef.current >= PX_PER_NOTE) {
        pixelAccRef.current = 0;
        nextNote();
      }
    };

    // ── Any gesture unlocks context ───────────────────────────────────────
    const onGesture = () => {
      if (ctx.state === "suspended") ctx.resume().catch(() => {});
    };
    const gestureEvents = [
      "click",
      "keydown",
      "pointerdown",
      "touchstart",
    ] as const;
    gestureEvents.forEach((e) =>
      window.addEventListener(e, onGesture, { passive: true }),
    );

    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      gestureEvents.forEach((e) => window.removeEventListener(e, onGesture));
      try {
        ctx.close();
      } catch {}
      ctxRef.current = null;
      masterRef.current = null;
      reverbRef.current = null;
    };
  }, []);

  return null;
}
