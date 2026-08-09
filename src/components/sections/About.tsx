"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const highlights = [
  {
    icon: "🎮",
    logo: "/logos/junglee-games.png",
    label: "Gaming Industry",
    value: "Junglee Games",
  },
  { icon: "👥", label: "Users Impacted", value: "800K+" },
  { icon: "🛠️", label: "RBAC Permissions", value: "20+" },
  { icon: "💳", label: "Payment Gateway", value: "Worldpay" },
];

const techStack = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Node.js",
  "Nest.js",
  "MongoDB",
  "AWS",
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Staggered entrance
      gsap.from(".about-animate", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // Parallax on background decoration
      gsap.to(".about-bg-decor", {
        y: -60,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-20 px-4 md:py-24 md:px-8 lg:py-32 lg:px-16 relative z-10 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="about-bg-decor">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image/Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative mx-auto w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Gradient ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 animate-spin-slow opacity-20" />

              {/* Avatar container */}
              <div className="absolute inset-2 rounded-full bg-white overflow-hidden border-4 border-stone-200">
                <Image
                  src="/chirag.webp"
                  alt="Chirag Kumar"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4 bg-white rounded-xl p-3 border border-stone-200"
              >
                <span className="text-2xl">⚡</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 border border-stone-200"
              >
                <span className="text-2xl">🚀</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div ref={contentRef} className="space-y-6">
            <div className="about-animate">
              <span className="text-primary-500 font-medium text-sm uppercase tracking-wider px-2 py-1 -mx-2 rounded transition-all duration-300 hover:bg-primary-500/[0.08]">
                About Me
              </span>
              <h2 className="section-heading mt-2 text-accent-800 px-3 py-2 -mx-3 rounded-lg transition-all duration-300 hover:bg-stone-100">
                Full Stack Engineer,{" "}
                <span className="gradient-text">Systems Thinker</span>
              </h2>
            </div>

            <div className="about-animate space-y-4 text-stone-600 leading-relaxed">
              <p className="px-3 py-2 -mx-3 rounded-lg transition-all duration-300 hover:bg-stone-100 hover:text-stone-700">
                I&apos;m a{" "}
                <strong className="text-accent-800">
                  Software Development Engineer 2
                </strong>{" "}
                at <strong className="text-primary-600">Junglee Games</strong>,
                where I build scalable systems that power gaming experiences for
                over 800,000 users.
              </p>
              <p className="px-3 py-2 -mx-3 rounded-lg transition-all duration-300 hover:bg-stone-100 hover:text-stone-700">
                With{" "}
                <strong className="text-accent-800">
                  2.5+ years of professional experience
                </strong>
                , I specialize in developing gamification features, payment
                integrations, and robust backend architectures. My work has
                directly contributed to improved user engagement, retention
                KPIs, and revenue optimization.
              </p>
              <p className="px-3 py-2 -mx-3 rounded-lg transition-all duration-300 hover:bg-stone-100 hover:text-stone-700">
                I&apos;m passionate about writing clean, maintainable code and
                staying up-to-date with the latest technologies. When I&apos;m
                not coding, you&apos;ll find me exploring new frameworks or
                contributing to open-source projects.
              </p>
            </div>

            {/* Tech Stack */}
            <div className="about-animate">
              <p className="text-sm font-medium text-stone-600 mb-3 px-2 py-1 -mx-2 rounded transition-all duration-300 hover:bg-stone-100 hover:text-stone-700 inline-block">
                Tech I work with:
              </p>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span key={tech} className="skill-badge text-stone-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="about-animate grid grid-cols-2 gap-4 pt-4">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="p-4 bg-white rounded-xl border border-stone-200"
                >
                  {item.logo ? (
                    <Image
                      src={item.logo}
                      alt={item.value}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <span className="text-2xl">{item.icon}</span>
                  )}
                  <p className="text-lg font-bold text-accent-800 mt-2">
                    {item.value}
                  </p>
                  <p className="text-sm text-stone-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
