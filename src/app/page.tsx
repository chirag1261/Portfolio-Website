"use client";

import { useEffect } from "react";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { FloatingLogos } from "@/components/layout/FloatingLogos";

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
      {/* Floating tech logos background */}
      <FloatingLogos />

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
