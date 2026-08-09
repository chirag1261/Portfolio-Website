"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

interface Experience {
  id: number;
  role: string;
  company: string;
  logo: string;
  logoDarkBg?: boolean;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
}

const experiences: Experience[] = [
  {
    id: 1,
    role: "SDE 2 — Full Stack Engineer",
    company: "Junglee Games",
    logo: "/logos/junglee-games.png",
    period: "January 2026 - Present",
    location: "Gurugram, India",
    description: [
      "Architected scalable promo code & discount system end-to-end with reusable React/TypeScript components, configurable validation, stacking logic, and NestJS/AWS backend services enabling rapid campaign experimentation.",
      "Integrated Worldpay payment gateway with responsive UI flows for initiation, failure handling, and reconciliation, improving transaction success rates and reducing drop-offs.",
      "Integrated Meta event tracking across critical funnels (registration, deposits, gameplay), enabling data-driven campaign optimization with measurable ROI improvements.",
      "Spearheaded frontend modernization for 800K+ user platform: migrated to feature-based modular architecture, extracted shared hooks/components/utilities, and leveraged AI-assisted code generation for large-scale refactoring.",
    ],
    technologies: [
      "React.js",
      "TypeScript",
      "Node.js",
      "Nest.js",
      "AWS",
      "MongoDB",
      "Redis",
    ],
  },
  {
    id: 2,
    role: "SDE 1 — Frontend Engineer",
    company: "Junglee Games",
    logo: "/logos/junglee-games.png",
    period: "August 2024 - December 2025",
    location: "Gurugram, India",
    description: [
      "Built high-performance, accessible React UI features — Spin the Wheel, Slot Machine, Streak Challenge, Drop or Not — enhancing engagement for 800K+ users through gamified real-time interfaces.",
      "Developed reusable, schema-driven TypeScript component libraries with dynamic payload utilities, improving maintainability and developer productivity across multiple teams.",
      "Implemented RBAC (20+ permissions) with time-based UI rules using OOP patterns; optimized complex SQL queries across high-traffic distributed systems, significantly improving query execution efficiency.",
      "Mentored junior developers on architecture guidelines, code review standards, and reusable component design patterns.",
    ],
    technologies: [
      "React.js",
      "Node.js",
      "TypeScript",
      "MongoDB",
      "SQL",
      "Redis",
    ],
  },
  {
    id: 3,
    role: "Frontend Developer",
    company: "Fly Realty",
    logo: "/logos/fly-realty.png",
    logoDarkBg: true,
    period: "January 2024 - July 2024",
    location: "Remote",
    description: [
      "Built a production-grade Next.js application with PrimeReact and Redux Saga, delivering responsive interfaces with seamless async state management and cross-browser compatibility.",
      "Automated Lighthouse CI and Puppeteer pipelines to enforce performance and accessibility standards, significantly improving web vitals scores; integrated IAM and a JavaScript bridge for web-to-native interaction.",
    ],
    technologies: [
      "Next.js",
      "React.js",
      "Redux Saga",
      "PrimeReact",
      "TypeScript",
    ],
  },
];

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [sparks, setSparks] = useState<
    Array<{ id: number; x: number; y: number; angle: number; color: string }>
  >([]);
  const sparkIdRef = useRef(0);
  const lastSparkTimeRef = useRef(0);

  // Track scroll progress through the experience section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 60%", "end 40%"],
  });

  // Emit firecracker sparks at the burning tip. Throttled — without this,
  // every scroll-progress tick triggers a layout read (getBoundingClientRect)
  // plus a React re-render, which is enough to visibly stutter scrolling.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const now = performance.now();
    if (now - lastSparkTimeRef.current < 70) return;
    lastSparkTimeRef.current = now;

    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const tipY = rect.top + rect.height * latest;
    const tipX = rect.left + rect.width / 2;

    // Only spark when actively scrolling (progress changing)
    const sparkColors = [
      "#f43f5e",
      "#fb923c",
      "#fbbf24",
      "#22d3ee",
      "#a855f7",
      "#34d399",
      "#ef4444",
      "#ffffff",
    ];
    const count = 3 + Math.floor(Math.random() * 3);
    const newSparks = Array.from({ length: count }, () => {
      sparkIdRef.current += 1;
      return {
        id: sparkIdRef.current,
        x: tipX,
        y: tipY,
        angle: Math.random() * 360,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
      };
    });
    setSparks((prev) => [...prev.slice(-30), ...newSparks]);
  });

  // Clean up sparks after animation
  useEffect(() => {
    if (sparks.length === 0) return;
    const timer = setTimeout(() => {
      setSparks((prev) => prev.slice(Math.max(0, prev.length - 20)));
    }, 600);
    return () => clearTimeout(timer);
  }, [sparks]);

  // Progress value for the burning line
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".experience-card", {
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-20 px-4 md:py-24 md:px-8 lg:py-32 lg:px-16 relative z-10 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-500 font-medium text-sm uppercase tracking-wider">
            Career Journey
          </span>
          <h2 className="section-heading mt-2 text-accent-800">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="section-subheading mx-auto">
            Building scalable solutions and driving impact at every step
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line (firecracker fuse) */}
          <div
            ref={timelineRef}
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-stone-200 transform md:-translate-x-1/2"
          >
            {/* Burning progress line */}
            <motion.div
              className="absolute inset-x-0 top-0 origin-top"
              style={{
                scaleY: lineScaleY,
                background:
                  "linear-gradient(to bottom, #f43f5e, #fb923c, #fbbf24, #ef4444)",
                height: "100%",
                boxShadow: "0 0 8px #fb923c, 0 0 20px #f43f5e80",
              }}
            />
            {/* Glowing ember at the tip */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{
                top: useTransform(scrollYProgress, (v) => `${v * 100}%`),
                background:
                  "radial-gradient(circle, #fef3c7, #fb923c, #ef4444)",
                boxShadow:
                  "0 0 12px 4px #fb923c, 0 0 30px 8px #f43f5e80, 0 0 50px 12px #fbbf2440",
                filter: "blur(0.5px)",
              }}
            >
              {/* Inner white-hot core */}
              <div className="absolute inset-0.5 rounded-full bg-white/80 animate-pulse" />
            </motion.div>
          </div>

          {/* Firecracker sparks (portal to fixed overlay) */}
          <div className="fixed inset-0 pointer-events-none z-50">
            {sparks.map((spark) => (
              <motion.div
                key={spark.id}
                initial={{
                  x: spark.x,
                  y: spark.y,
                  scale: 1,
                  opacity: 1,
                }}
                animate={{
                  x:
                    spark.x +
                    Math.cos((spark.angle * Math.PI) / 180) *
                      (20 + Math.random() * 40),
                  y:
                    spark.y +
                    Math.sin((spark.angle * Math.PI) / 180) *
                      (20 + Math.random() * 40) +
                    10,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.4 + Math.random() * 0.3,
                  ease: "easeOut",
                }}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: spark.color,
                  boxShadow: `0 0 4px ${spark.color}, 0 0 8px ${spark.color}80`,
                }}
              />
            ))}
          </div>

          {/* Experience Cards */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`experience-card relative flex flex-col md:flex-row ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full border-4 border-stone-50 transform -translate-x-[7px] md:-translate-x-1/2 z-10" />

                {/* Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`ml-8 md:ml-0 md:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                  }`}
                >
                  <div className="card">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`relative flex-shrink-0 h-11 sm:h-12 flex items-center justify-center rounded-lg px-2 ${
                            exp.logoDarkBg
                              ? "bg-black"
                              : "bg-white border border-stone-200"
                          }`}
                        >
                          <Image
                            src={exp.logo}
                            alt={`${exp.company} logo`}
                            width={exp.logoDarkBg ? 160 : 40}
                            height={exp.logoDarkBg ? 19 : 40}
                            className={
                              exp.logoDarkBg
                                ? "h-4 sm:h-[18px] w-auto object-contain"
                                : "h-7 sm:h-8 w-auto object-contain"
                            }
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-accent-800">
                            {exp.role}
                          </h3>
                          <p className="text-primary-600 font-semibold">
                            {exp.company}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                          {exp.period}
                        </span>
                        <p className="text-stone-500 text-sm mt-1">
                          {exp.location}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <ul className="space-y-2 mb-4">
                      {exp.description.map((item, i) => (
                        <li
                          key={i}
                          className="text-stone-600 text-sm leading-relaxed flex"
                        >
                          <span className="text-primary-500 mr-2 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-200">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-md border border-stone-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
