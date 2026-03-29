"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSound } from "@/components/providers/SoundContext";

// Blinding Lights synth melody — iconic opening riff (F minor key)
// The synth hook: F4 F4 Ab4 Bb4 | C5 Bb4 Ab4 F4 | Eb4 F4 Ab4 Bb4 | Ab4 F4 Eb4 F4
const BLINDING_LIGHTS_MELODY = [
  349.23,
  349.23,
  415.3,
  466.16, // F4 F4 Ab4 Bb4
  523.25,
  466.16,
  415.3,
  349.23, // C5 Bb4 Ab4 F4
  311.13,
  349.23,
  415.3,
  466.16, // Eb4 F4 Ab4 Bb4
  415.3,
  349.23,
  311.13,
  349.23, // Ab4 F4 Eb4 F4
  349.23,
  349.23,
  415.3,
  466.16, // repeat
  523.25,
  466.16,
  415.3,
  349.23,
  311.13,
  349.23,
  415.3,
  466.16,
  523.25,
  523.25,
  466.16,
  415.3,
];

export function ScrollSoundVibration() {
  const { isMuted } = useSound();
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastScrollY = useRef(0);
  const lastSoundTime = useRef(0);
  const lastVibTime = useRef(0);
  const sectionTops = useRef<number[]>([]);
  const lastSection = useRef(-1);
  const noteIndex = useRef(0);

  // Initialize AudioContext on first user interaction
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // 80s synth pluck — Blinding Lights melody on scroll
  const playTick = useCallback(
    (velocity: number) => {
      if (isMutedRef.current) return;
      try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;

        const freq =
          BLINDING_LIGHTS_MELODY[
            noteIndex.current % BLINDING_LIGHTS_MELODY.length
          ];
        noteIndex.current++;

        // Main synth oscillator — bright square wave (80s retro synth)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const masterGain = ctx.createGain();
        const synthFilter = ctx.createBiquadFilter();

        // Detuned square waves for thick 80s synth pad
        osc1.type = "square";
        osc1.frequency.setValueAtTime(freq, now);

        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(freq * 1.003, now); // Slight detune for width

        // Sub oscillator for warmth
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(freq / 2, now);

        const g1 = ctx.createGain();
        const g2 = ctx.createGain();
        const gSub = ctx.createGain();

        const vol = Math.min(0.025 + Math.abs(velocity) * 0.0002, 0.055);

        // Sharp plucky attack, quick decay — characteristic synth stab
        g1.gain.setValueAtTime(0, now);
        g1.gain.linearRampToValueAtTime(vol, now + 0.003);
        g1.gain.exponentialRampToValueAtTime(vol * 0.4, now + 0.06);
        g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

        g2.gain.setValueAtTime(0, now);
        g2.gain.linearRampToValueAtTime(vol * 0.6, now + 0.003);
        g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        gSub.gain.setValueAtTime(0, now);
        gSub.gain.linearRampToValueAtTime(vol * 0.35, now + 0.005);
        gSub.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

        // Filter sweep — opens bright then closes (80s synth character)
        synthFilter.type = "lowpass";
        synthFilter.frequency.setValueAtTime(4000, now);
        synthFilter.frequency.exponentialRampToValueAtTime(600, now + 0.15);
        synthFilter.Q.setValueAtTime(3, now);
        synthFilter.Q.linearRampToValueAtTime(0.5, now + 0.1);

        osc1.connect(g1);
        osc2.connect(g2);
        subOsc.connect(gSub);
        g1.connect(synthFilter);
        g2.connect(synthFilter);
        gSub.connect(synthFilter);
        synthFilter.connect(masterGain);
        masterGain.gain.setValueAtTime(1, now);
        masterGain.connect(ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.35);
        osc2.start(now);
        osc2.stop(now + 0.3);
        subOsc.start(now);
        subOsc.stop(now + 0.25);
      } catch {
        // Silently fail if audio not available
      }
    },
    [getAudioCtx],
  );

  // Glass chime tone on section transition
  const playSectionChime = useCallback(
    (sectionIndex: number) => {
      if (isMutedRef.current) return;
      try {
        const ctx = getAudioCtx();
        const now = ctx.currentTime;

        // Glass harmonic series — high pure sine tones with long shimmer
        const baseFreqs = [
          523.25, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51,
        ];
        const base = baseFreqs[sectionIndex % baseFreqs.length];
        // Glass harmonics: fundamental + octave + 5th + high shimmer
        const harmonics = [base, base * 2, base * 1.5, base * 3, base * 4];

        harmonics.forEach((freq, i) => {
          const delay = i * 0.04; // Gentle cascade
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          // Pure sine waves — glass resonance
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + delay);
          // Slight pitch drift upward — glass ring characteristic
          osc.frequency.linearRampToValueAtTime(
            freq * 1.002,
            now + delay + 0.8,
          );

          // Glass envelope: instant attack, long crystalline decay
          const v = (0.04 - i * 0.006) * (i === 0 ? 1 : 0.6);
          gain.gain.setValueAtTime(0, now + delay);
          gain.gain.linearRampToValueAtTime(
            Math.max(v, 0.005),
            now + delay + 0.002,
          );
          gain.gain.setValueAtTime(
            Math.max(v, 0.005) * 0.8,
            now + delay + 0.01,
          );
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.4);

          // High-pass to keep only the shimmery glass frequencies
          filter.type = "highpass";
          filter.frequency.setValueAtTime(300 + i * 200, now);
          filter.Q.setValueAtTime(0.3, now);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + delay);
          osc.stop(now + delay + 1.5);
        });
      } catch {
        // Silently fail
      }
    },
    [getAudioCtx],
  );

  // Vibrate (short pulse)
  const vibrate = useCallback((pattern: number | number[]) => {
    if (isMutedRef.current) return;
    try {
      if (navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Not all devices support vibration
    }
  }, []);

  useEffect(() => {
    // Cache section positions
    const cacheSections = () => {
      const ids = [
        "home",
        "about",
        "skills",
        "experience",
        "projects",
        "education",
        "contact",
      ];
      sectionTops.current = ids.map((id) => {
        const el = document.getElementById(id);
        return el ? el.offsetTop : 0;
      });
    };

    cacheSections();
    window.addEventListener("resize", cacheSections);

    // Initialize audio context on first interaction
    const initAudio = () => {
      getAudioCtx();
      window.removeEventListener("click", initAudio);
      window.removeEventListener("scroll", initAudio);
      window.removeEventListener("touchstart", initAudio);
    };
    window.addEventListener("click", initAudio, { once: true });
    window.addEventListener("scroll", initAudio, { once: true });
    window.addEventListener("touchstart", initAudio, { once: true });

    const handleScroll = () => {
      const now = performance.now();
      const scrollY = window.scrollY;
      const velocity = scrollY - lastScrollY.current;
      const absVelocity = Math.abs(velocity);
      lastScrollY.current = scrollY;

      // ── Scroll tick sounds (throttled) ──
      // Blinding Lights synth note interval — paced for the iconic rhythm
      const tickInterval = Math.max(70, 170 - absVelocity * 0.45);
      if (now - lastSoundTime.current > tickInterval && absVelocity > 4) {
        playTick(velocity);
        lastSoundTime.current = now;
      }

      // ── Vibration on scroll (throttled, subtle) ──
      if (now - lastVibTime.current > 80 && absVelocity > 5) {
        const duration = Math.min(Math.floor(absVelocity * 0.3), 15);
        if (duration > 2) {
          vibrate(duration);
          lastVibTime.current = now;
        }
      }

      // ── Section transition detection ──
      const currentSection = sectionTops.current.findIndex(
        (top, i) =>
          scrollY >= top - 200 &&
          (i === sectionTops.current.length - 1 ||
            scrollY < sectionTops.current[i + 1] - 200),
      );

      if (currentSection !== -1 && currentSection !== lastSection.current) {
        lastSection.current = currentSection;
        playSectionChime(currentSection);
        // Stronger vibration on section change
        vibrate([20, 30, 20]);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", cacheSections);
      window.removeEventListener("click", initAudio);
      window.removeEventListener("scroll", initAudio);
      window.removeEventListener("touchstart", initAudio);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [getAudioCtx, playTick, playSectionChime, vibrate]);

  return null; // No visual output
}
