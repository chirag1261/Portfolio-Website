"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Skill {
  name: string;
  icon: string;
  category: string;
  url: string;
}

const skills: Skill[] = [
  // Frontend
  {
    name: "React.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    category: "Frontend",
    url: "https://react.dev",
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    category: "Frontend",
    url: "https://nextjs.org",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    category: "Frontend",
    url: "https://www.typescriptlang.org",
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    category: "Frontend",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    name: "GSAP",
    icon: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg",
    category: "Frontend",
    url: "https://gsap.com",
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    category: "Frontend",
    url: "https://tailwindcss.com",
  },
  {
    name: "Redux Saga",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
    category: "Frontend",
    url: "https://redux-saga.js.org",
  },
  {
    name: "HTML5",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    category: "Frontend",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },
  {
    name: "CSS3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    category: "Frontend",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },
  {
    name: "Bootstrap",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
    category: "Frontend",
    url: "https://getbootstrap.com",
  },

  // Backend
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    category: "Backend",
    url: "https://nodejs.org",
  },
  {
    name: "Nest.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg",
    category: "Backend",
    url: "https://nestjs.com",
  },
  {
    name: "PHP",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
    category: "Backend",
    url: "https://www.php.net",
  },
  {
    name: "Laravel",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
    category: "Backend",
    url: "https://laravel.com",
  },
  {
    name: "Express.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    category: "Backend",
    url: "https://expressjs.com",
  },
  {
    name: "REST APIs",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
    category: "Backend",
    url: "https://restfulapi.net",
  },

  // Database
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    category: "Database",
    url: "https://www.mongodb.com",
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    category: "Database",
    url: "https://www.mysql.com",
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    category: "Database",
    url: "https://www.postgresql.org",
  },

  // Cloud & DevOps
  {
    name: "AWS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
    category: "Cloud & DevOps",
    url: "https://aws.amazon.com",
  },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    category: "Cloud & DevOps",
    url: "https://git-scm.com",
  },
  {
    name: "GitHub",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    category: "Cloud & DevOps",
    url: "https://github.com",
  },

  // Tools
  {
    name: "Postman",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg",
    category: "Tools",
    url: "https://www.postman.com",
  },
  {
    name: "Mockoon",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/json/json-original.svg",
    category: "Tools",
    url: "https://mockoon.com",
  },
];

const categories = [
  "Frontend",
  "Backend",
  "Database",
  "Cloud & DevOps",
  "Tools",
];

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".skill-card");
      const total = cards.length;

      // Set initial tornado state — all cards start scattered in a vortex
      cards.forEach((card, i) => {
        const angle = (i / total) * Math.PI * 6; // 3 full spiral loops
        const radius = 400 + i * 8;
        const xOff = Math.cos(angle) * radius;
        const yOff = Math.sin(angle) * radius - 300;
        const spin = (i % 2 === 0 ? 1 : -1) * (720 + Math.random() * 360);

        gsap.set(card, {
          transformPerspective: 1000,
          x: xOff,
          y: yOff,
          rotation: spin,
          rotateX: Math.random() * 40 - 20,
          rotateY: Math.random() * 40 - 20,
          scale: 0.2,
          opacity: 0,
        });

        // All cards animate together, triggered by section entering viewport
        gsap.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 20%",
            scrub: 1.5,
          },
        });
      });

      // Parallax background glow
      gsap.to(".skills-bg-glow", {
        y: -80,
        scale: 1.1,
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
      id="skills"
      className="py-20 px-4 md:py-24 md:px-8 lg:py-32 lg:px-16 relative z-10 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="skills-bg-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary-500 font-medium text-sm uppercase tracking-wider">
            My Skills
          </span>
          <h2 className="section-heading mt-2 text-accent-800">
            Technologies I <span className="gradient-text">Work With</span>
          </h2>
          <p className="section-subheading mx-auto">
            A comprehensive toolkit for building modern, scalable, and
            performant applications
          </p>
        </motion.div>

        {/* Skills by Category */}
        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-stone-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                {category}
              </h3>
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                style={{ perspective: "1200px" }}
              >
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <motion.a
                      key={skill.name}
                      href={skill.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="skill-card"
                      style={{ willChange: "transform, opacity" }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="card text-center cursor-pointer group">
                        <img
                          src={skill.icon}
                          alt={skill.name}
                          className="w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform"
                          loading="lazy"
                        />
                        <p className="text-sm font-medium text-stone-700">
                          {skill.name}
                        </p>
                      </div>
                    </motion.a>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Skills Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-white rounded-2xl border border-stone-200"
        >
          <h3 className="text-lg font-semibold text-accent-800 mb-4">
            Other Competencies
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              "Object-Oriented Programming",
              "Low Level Design",
              "Clean Architecture",
              "Feature-Driven Architecture",
              "Design Patterns",
              "Distributed Systems",
              "RBAC",
              "Problem Solving",
              "Data Structures & Algorithms",
              "SDLC",
              "Agile Methodology",
              "System Design",
              "RESTful Architecture",
              "Microservices",
              "Code Review",
              "GitHub Copilot",
              "Agentic AI Workflows",
              "Lighthouse CI",
              "Puppeteer",
            ].map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-primary-50 hover:text-primary-700 transition-colors cursor-default border border-stone-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
