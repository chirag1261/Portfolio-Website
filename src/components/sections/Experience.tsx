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

interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
}

const experiences: Experience[] = [
  {
    id: 1,
    role: "SDE 2",
    company: "Junglee Games",
    period: "January 2026 - Present",
    location: "Gurugram, India",
    description: [
      "Designed and owned a scalable promo code and discount system, supporting configurable validation rules, stacking logic, expiry windows, and eligibility constraints, enabling rapid experimentation and improving campaign agility and monetization outcomes.",
      "Integrated Worldpay payment gateway, handling end-to-end flows including payment initiation, callbacks, reconciliation, failure handling, and retries, contributing to a reduction in payment drop-offs and improved transaction success rates.",
      "Integrated Meta (Facebook) event tracking across critical user funnels (registration, deposits, gameplay, and promotional interactions), enabling accurate attribution, data-driven campaign optimization, and measurable improvements in marketing ROI.",
    ],
    technologies: ["Node.js", "TypeScript", "MongoDB", "Redis", "REST APIs"],
  },
  {
    id: 2,
    role: "SDE 1",
    company: "Junglee Games",
    period: "August 2024 - December 2025",
    location: "Gurugram, India",
    description: [
      "Implemented RBAC with 20+ permissions, integrated advanced rules (time-based highlighting/pinning, discount periods, eligibility checks), and built schema-driven TypeScript forms with utilities for accurate dynamic payloads.",
      "Spearheaded the development of interactive marketing features for a leading online gaming platform, enhancing engagement for 800K+ users through gamified promotions like Spin the Wheel, Slot Machine, Streak Challenge, and quiz-based reward flows.",
      "Designed and optimized complex SQL queries, improving efficiency and reducing execution time across high-traffic apps, while contributing to scalable, high-availability backend data architecture.",
      "Integrated VIP-tier-based gamification mechanics, mapping rewards and experiences dynamically based on user category and activity, improving personalization and retention KPIs.",
      "Built real-time promo progress trackers using API-driven state updates, guiding users through milestone-based journeys.",
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
    period: "January 2024 - July 2024",
    location: "Remote",
    description: [
      "Successfully developed a Next.js dynamic application utilizing PrimeReact and Redux Saga, enabling seamless data management and asynchronous behavior.",
      "Integrated identity and access management (IAM) to ensure secure access control and identity management across the application.",
      "Delivered impactful landing pages for builder websites, automated Lighthouse CI and Puppeteer testing, enhancing page optimization.",
      "Utilized ES6 JavaScript with React.js for developing responsive front-end pages and implemented a JavaScript bridge for seamless interaction between web and native components.",
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

  // Track scroll progress through the experience section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 60%", "end 40%"],
  });

  // Emit firecracker sparks at the burning tip
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
          <h2 className="section-heading mt-2 text-slate-100">
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
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#334155] transform md:-translate-x-1/2"
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
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full border-4 border-[#0f172a] transform -translate-x-[7px] md:-translate-x-1/2 z-10 shadow-lg" />

                {/* Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  className={`ml-8 md:ml-0 md:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                  }`}
                >
                  <div className="card bg-[#1e293b] shadow-lg hover:shadow-xl">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-100">
                          {exp.role}
                        </h3>
                        <p className="text-primary-500 font-semibold">
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-sky-900/40 text-sky-400 text-xs font-medium rounded-full">
                          {exp.period}
                        </span>
                        <p className="text-slate-500 text-sm mt-1">
                          {exp.location}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <ul className="space-y-2 mb-4">
                      {exp.description.map((item, i) => (
                        <li
                          key={i}
                          className="text-slate-400 text-sm leading-relaxed flex"
                        >
                          <span className="text-primary-500 mr-2 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-[#0f172a] text-slate-400 text-xs rounded-md border border-white/5"
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
    </section>
  );
}
