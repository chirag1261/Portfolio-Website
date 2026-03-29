"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { FloatingGear } from "@/components/layout/FloatingGear";
import { ScrollSoundVibration } from "@/components/layout/ScrollSoundVibration";
import { FloatingLogos } from "@/components/layout/FloatingLogos";

// Lazy load Three.js scene for better performance
const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  useEffect(() => {
    // Initialize GSAP ScrollTrigger
    const initScrollTrigger = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
    };
    initScrollTrigger();
  }, []);

  return (
    <>
      {/* 3D Background */}
      <Scene />

      {/* Floating tech logos background */}
      <FloatingLogos />

      {/* Floating gear that follows scroll across all sections */}
      <FloatingGear />

      {/* Scroll sound effects & haptic vibration */}
      <ScrollSoundVibration />

      {/* Hero stays full-screen vertical */}
      <Hero />

      {/* Sections */}
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />

      {/* Contact */}
      <Contact />
    </>
  );
}
