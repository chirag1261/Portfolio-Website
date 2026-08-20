"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  screenshot?: string;
  technologies: string[];
  github: string;
  live?: string;
  category: string;
  featured: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: "All-Spark — Event Booking Platform",
    description:
      "Multi-event ticketing platform with seat selection, Razorpay payments, and an admin dashboard",
    longDescription:
      "A production event booking platform (live at utsavevents.live): admins create multi-category ticketed events with registration windows, banners and FAQs, while attendees pick seats on an interactive auditorium map, pay via Razorpay, and receive a unique QR ticket by email. Includes a full admin dashboard with role-based permissions, real-time seat locking, refunds, OTP-based customer accounts, and an audit trail.",
    image: "🎟️",
    screenshot: "/projects/all-spark.png",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Razorpay",
      "Tailwind CSS",
    ],
    github: "https://github.com/chirag1261/all-spark",
    live: "https://utsavevents.live",
    category: "Full Stack",
    featured: true,
  },
  {
    id: 2,
    title: "Study Notion",
    description:
      "Full-fledged Ed-Tech platform for students, instructors, and admins",
    longDescription:
      "A comprehensive MERN-based educational technology platform that enables instructors to showcase their expertise and connect with learners globally. Features include course creation, consumption, rating system, secure payments via RazorPay, and email notifications.",
    image: "📚",
    screenshot: "/projects/study-notion.png",
    technologies: [
      "React.js",
      "Node.js",
      "MongoDB",
      "Express.js",
      "Tailwind CSS",
      "Cloudinary",
      "RazorPay",
    ],
    github: "https://github.com/chirag1261/ED_Tech-Study-Notion",
    live: "https://ed-tech-study-notion-frontend.vercel.app/",
    category: "Full Stack",
    featured: true,
  },
  {
    id: 3,
    title: "Shopingooo",
    description: "Complete e-commerce platform with secure payments",
    longDescription:
      "A full-fledged e-commerce website featuring product catalog, shopping cart, checkout process, and secure payment gateway integration with Stripe. Built with MERN stack and leverages Cloudinary for media storage.",
    image: "🛒",
    technologies: [
      "React.js",
      "Node.js",
      "MongoDB",
      "Express.js",
      "Stripe",
      "Cloudinary",
    ],
    github: "https://github.com/chirag1261/ShopingooWeb",
    live: "https://shopingecommm.onrender.com/",
    category: "Full Stack",
    featured: true,
  },
  {
    id: 4,
    title: "Book Wagon",
    description: "Desktop application for online book renting",
    longDescription:
      "A desktop application using ASP.net where users can rent their own books or rent books for a particular period of time. Features user authentication, book management, and rental tracking.",
    image: "📖",
    technologies: ["ASP.net", "C#", "MySQL", "JavaScript", "CSS"],
    github: "https://github.com/chirag1261/Online-Book-Renting-System",
    category: "Desktop App",
    featured: false,
  },
  {
    id: 5,
    title: "Weather App",
    description: "React weather application with 5-day forecast",
    longDescription:
      "A React-based weather application where users can search for any city and view the current weather along with a 5-day forecast. Uses weather API for real-time data.",
    image: "🌤️",
    screenshot: "/projects/weather-app.jpg",
    technologies: ["React.js", "JavaScript", "CSS", "Weather API"],
    github: "https://github.com/chirag1261/CurrentWeatherApp",
    live: "https://reactcurrentweatherwebsite.netlify.app/",
    category: "Frontend",
    featured: false,
  },
  {
    id: 6,
    title: "Roomner",
    description: "Android app to find ideal flatmates",
    longDescription:
      "An Android application designed to help bachelors instantly find ideal flatmates while moving to a new city. Features real-time matching, chat functionality, and user profiles.",
    image: "🏠",
    technologies: ["Java", "Firebase", "Android Studio"],
    github: "https://github.com/chirag1261/Roomner",
    category: "Mobile App",
    featured: false,
  },
  {
    id: 7,
    title: "MovieTime",
    description: "Movie ticket booking system",
    longDescription:
      "A web-based application where users can search, sort, and book movie tickets from local theatres. Features theatre management, seat selection, and booking confirmation.",
    image: "🎬",
    technologies: ["PHP", "JavaScript", "SQLite", "CSS", "HTML"],
    github:
      "https://github.com/chirag1261/Movietime---Movie-Ticket-Booking-System",
    category: "Full Stack",
    featured: false,
  },
];

const categories = [
  "All",
  "Full Stack",
  "Frontend",
  "Mobile App",
  "Desktop App",
];

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Staggered 3D entrance from below with rotation
      const cards = gsap.utils.toArray<HTMLElement>(".project-card");
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 100,
            rotateX: 15,
            scale: 0.85,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 65%",
              scrub: 1,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [activeCategory]);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-20 px-4 md:py-24 md:px-8 lg:py-32 lg:px-16 relative z-10 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-500 font-medium text-sm uppercase tracking-wider">
            My Work
          </span>
          <h2 className="section-heading mt-2 text-accent-800">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subheading mx-auto">
            A collection of projects showcasing my skills in full-stack
            development
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: "1200px" }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="project-card"
                style={{ transformStyle: "preserve-3d" }}
              >
                <TiltCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/chirag1261"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline inline-flex items-center gap-2"
          >
            <GitHubIcon className="w-5 h-5" />
            View All Projects on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 3D Card with animated project logo ─── */
function TiltCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLSpanElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  // Continuous 3D emoji animation
  useEffect(() => {
    const emoji = emojiRef.current;
    const shadow = shadowRef.current;
    if (!emoji || !shadow) return;

    // Floating bob + slow Y rotation
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(emoji, {
      y: -12,
      rotateY: 15,
      rotateX: -5,
      duration: 2.4,
      ease: "sine.inOut",
    }).to(emoji, {
      y: 0,
      rotateY: -15,
      rotateX: 5,
      duration: 2.4,
      ease: "sine.inOut",
    });

    // Shadow pulses in sync
    const shadowTl = gsap.timeline({ repeat: -1, yoyo: true });
    shadowTl
      .to(shadow, {
        scale: 0.7,
        opacity: 0.25,
        duration: 2.4,
        ease: "sine.inOut",
      })
      .to(shadow, {
        scale: 1,
        opacity: 0.5,
        duration: 2.4,
        ease: "sine.inOut",
      });

    return () => {
      tl.kill();
      shadowTl.kill();
    };
  }, []);

  return (
    <div ref={cardRef} className="relative h-full rounded-2xl">
      {/* Card body */}
      <div className="group relative h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200">
        {/* Project Image/Icon Area */}
        <div className="relative h-52 bg-gradient-to-br from-primary-500/5 via-white to-accent-500/5 flex items-center justify-center overflow-hidden">
          {project.screenshot ? (
            <Image
              src={project.screenshot}
              alt={`${project.title} screenshot`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover object-top"
            />
          ) : (
            <>
              {/* Subtle grid background */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(184,134,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(184,134,11,0.3) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                  transform: "perspective(500px) rotateX(50deg) scale(1.8)",
                  transformOrigin: "center bottom",
                }}
              />

              {/* Orbiting ring behind emoji */}
              <div
                className="absolute w-28 h-28 rounded-full border border-primary-500/20"
                style={{
                  animation: "orbitSpin 8s linear infinite",
                  transformStyle: "preserve-3d",
                  transform: "rotateX(65deg)",
                }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-400/60" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-400/60" />
              </div>

              {/* Second orbit ring */}
              <div
                className="absolute w-36 h-36 rounded-full border border-accent-500/10"
                style={{
                  animation: "orbitSpin 12s linear infinite reverse",
                  transformStyle: "preserve-3d",
                  transform: "rotateX(65deg) rotateZ(45deg)",
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400/40" />
              </div>

              {/* 3D Animated Emoji */}
              <span
                ref={emojiRef}
                className="text-7xl relative z-10"
                style={{
                  transformStyle: "preserve-3d",
                  filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.3))",
                }}
              >
                {project.image}
              </span>

              {/* Ground shadow under emoji */}
              <div
                ref={shadowRef}
                className="absolute bottom-6 w-20 h-4 rounded-full bg-black/30 blur-md z-0"
              />
            </>
          )}

          {/* Featured Badge */}
          {project.featured && (
            <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold rounded-full z-30">
              ★ Featured
            </span>
          )}

          {/* Overlay with action buttons */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/95 via-dark-900/40 to-transparent flex items-end justify-center p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none group-hover:pointer-events-auto">
            <div className="flex gap-3">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20"
                aria-label="View GitHub"
              >
                <GitHubIcon className="w-4 h-4" />
                Code
              </a>
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 backdrop-blur-sm rounded-xl text-primary-300 text-sm font-medium transition-all border border-primary-500/20 hover:border-primary-500/40"
                  aria-label="View Live"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  Live
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col relative">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            {project.category}
          </span>
          <h3 className="text-lg font-bold text-accent-800 mb-2">
            {project.title}
          </h3>
          <p className="text-stone-600 text-sm mb-4 flex-1 leading-relaxed">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-stone-200">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs rounded-lg border border-stone-200 hover:border-primary-500/40 hover:text-primary-700 transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-2.5 py-1 text-stone-600 text-xs">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes orbitSpin {
          from {
            transform: rotateX(65deg) rotateZ(0deg);
          }
          to {
            transform: rotateX(65deg) rotateZ(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// Icons
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}
