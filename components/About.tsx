"use client";

import { MapPin, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const skillBadges = [
  "Fullstack Development",
  "Frontend Development",
  "App Development",
  "HTML & CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Flutter",
  "Dart",
  "UI / UX",
  "Tailwind CSS",
  "Procreate",
  "Photoshop",
];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-36 bg-white overflow-hidden">
      <div className="max-w-screen-lg mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* ── Column 1: Heading, Badges, Philosophy card ── */}
          <div className="flex flex-col gap-8">
            {/* Heading */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="md:text-7xl text-6xl uppercase pt-4 pb-2 tracking-tight"
              >
                About
              </motion.h1>
            </div>

            {/* Skill badges — staggered fade in */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                visible: { transition: { staggerChildren: 0.04 } },
              }}
              className="flex flex-wrap gap-2.5"
            >
              {skillBadges.map((badge) => (
                <motion.span
                  key={badge}
                  variants={{
                    hidden: { opacity: 0, scale: 0.85 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-raspberry text-white px-4 py-2 text-xs font-bold tracking-wider uppercase select-none hover:bg-raspberry-hover transition-colors cursor-default"
                >
                  {badge}
                </motion.span>
              ))}
            </motion.div>

            {/* Coding Philosophy card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-gray-200 border-l-4 border-l-raspberry shadow-sm"
            >
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-raspberry/5 text-raspberry shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider text-black">
                    Albert Einstein
                  </h4>
                  <p className="text-xs text-gray-500 font-mono mt-1 leading-relaxed">
                    &ldquo;Creativity is intelligence having fun.&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Column 2: Bio, Quick Facts, CTAs ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-8"
          >
            {/* Bio */}
            <div className="flex flex-col gap-5 text-gray-700 text-base md:text-lg leading-relaxed">
              <h2 className="text-2xl font-extrabold text-black tracking-tight">
                Hi, I&apos;m Miriam
              </h2>
              <p className="text-gray-600 leading-relaxed">
                I&apos;m a frontend web and app developer from Hamburg with a
                thing for design, details, and the space where code meets craft.
                I build responsive websites and apps that feel as good as they
                look — technically solid, visually considered, and shaped around
                the people and projects behind them.
              </p>
              <p className="text-gray-600 leading-relaxed">
                My background in art and design isn&apos;t just a hobby
                footnote. It influences how I think about layouts, colour, and
                the small decisions that make a digital product feel intentional
                rather than assembled.
              </p>
              <p className="text-gray-600 leading-relaxed">
                When I&apos;m not coding, you&apos;ll find me in my art studio,
                out on my bike or in my garden enjoying the fresh air and
                colours of nature.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">
                    Based in
                  </h5>
                  <p className="text-xs font-bold text-black">
                    Hamburg, Germany
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 text-gray-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-mono text-[10px] uppercase text-gray-400 tracking-wider">
                    Status
                  </h5>
                  <p className="text-xs font-bold text-black">
                    Available for Freelance
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/contact"
                className="px-6 py-3 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-raspberry transition-colors shadow-sm no-underline"
              >
                Let&apos;s Collaborate
              </Link>
              <a
                href="https://www.linkedin.com/in/miriam-schwartz-568aaa30b/"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 border border-gray-200 text-black font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors no-underline"
              >
                LinkedIn Profile
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
