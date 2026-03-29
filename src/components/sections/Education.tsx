"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

import Image from "next/image";

interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  period: string;
  grade: string;
  icon: string;
  logo: string;
  status: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const education: EducationItem[] = [
  {
    id: 1,
    degree: "Master's of Computer Application (MCA)",
    institution: "Vellore Institute of Technology",
    period: "2022 - 2024",
    grade: "CGPA: 8.89",
    icon: "🎓",
    logo: "https://chirag1261.github.io/Portfolio.github.io/assets/vit.png",
    status: "Postgraduation",
  },
  {
    id: 2,
    degree: "Bachelor's of Computer Application (BCA)",
    institution: "Kristu Jayanti College",
    period: "2019 - 2022",
    grade: "CGPA: 9.04",
    icon: "📜",
    logo: "https://chirag1261.github.io/Portfolio.github.io/assets/kristu.png",
    status: "Graduation",
  },
  {
    id: 3,
    degree: "Higher Secondary School (+2)",
    institution: "St. Xavier's School, Bokaro",
    period: "2017 - 2019",
    grade: "Class - 12th (ISC)",
    icon: "📚",
    logo: "https://chirag1261.github.io/Portfolio.github.io/assets/xaviers.png",
    status: "Completed",
  },
];

const achievements: Achievement[] = [
  {
    id: 1,
    title: "Top Rookie Award",
    description:
      "Awarded for outstanding performance and contribution within the first 6 months at Junglee Games",
    icon: "🏆",
  },
  {
    id: 2,
    title: "IBM Hackathon Runner-up",
    description:
      "Secured runner-up position in IBM Hackathon 2020 organized by Kristu Jayanti College",
    icon: "🥈",
  },
];

const certifications = [
  "AWS Cloud Practitioner Essentials",
  "Core Java Training",
  "MERN Stack Web Development Bootcamp",
  "IBM Cybersecurity Fundamentals",
  "Google Ads Apps Certification",
  "Problem Solving (HackerRank)",
];

export function Education() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="education"
      className="py-20 px-4 md:py-24 md:px-8 lg:py-32 lg:px-16 relative z-10 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-500 font-medium text-sm uppercase tracking-wider">
            Background
          </span>
          <h2 className="section-heading mt-2 text-slate-100">
            Education & <span className="gradient-text">Achievements</span>
          </h2>
          <p className="section-subheading mx-auto">
            My academic journey and notable accomplishments
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Education */}
          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white">
                🎓
              </span>
              Education
            </h3>

            <div className="space-y-4">
              {education.map((edu) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: edu.id * 0.1, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                  className="edu-card card bg-[#1e293b] border-l-4 border-primary-500"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
                      <Image
                        src={edu.logo}
                        alt={edu.institution}
                        width={56}
                        height={56}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-100 text-lg">
                        {edu.degree}
                      </h4>
                      <p className="text-primary-500 font-medium">
                        {edu.institution}
                      </p>
                      <p className="text-slate-500 text-sm mt-0.5">
                        {edu.status}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                        <span className="text-slate-500">{edu.period}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        <span className="px-2 py-0.5 bg-green-900/30 text-green-400 rounded font-medium">
                          {edu.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-10">
              <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white">
                  📜
                </span>
                Certifications
              </h3>

              <div className="flex flex-wrap gap-3">
                {certifications.map((cert, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="px-4 py-2 bg-[#1e293b] text-slate-300 rounded-lg text-sm font-medium border border-white/10 hover:border-primary-500 hover:text-primary-400 transition-colors cursor-default"
                  >
                    {cert}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white">
                🏆
              </span>
              Achievements
            </h3>

            <div className="space-y-4">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: achievement.id * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="edu-card"
                >
                  <div className="card bg-gradient-to-br from-primary-900/20 to-accent-900/20 border border-primary-800/50">
                    <div className="flex items-start gap-4">
                      <span className="text-5xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-bold text-slate-100 text-lg">
                          {achievement.title}
                        </h4>
                        <p className="text-slate-400 mt-1">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { label: "Academic Projects", value: "10+", icon: "📁" },
                { label: "Certifications", value: "8+", icon: "🎖️" },
                { label: "Awards", value: "2", icon: "🏅" },
                { label: "Hackathons", value: "3+", icon: "💻" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-[#1e293b] rounded-xl border border-white/10"
                >
                  <span className="text-2xl">{stat.icon}</span>
                  <p className="text-2xl font-bold gradient-text mt-2">
                    {stat.value}
                  </p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
