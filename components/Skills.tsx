"use client";

import { CheckCircle, Code2, Layers, Paintbrush, Terminal } from "lucide-react";
import { motion } from "motion/react";

type Skill = {
  name: string;
  level: number; // 1–5
};

type SkillGroup = {
  category: string;
  skills: Skill[];
};

const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: [
      { name: "JavaScript", level: 5 },
      { name: "TypeScript", level: 4 },
      { name: "HTML5 & CSS3", level: 5 },
      { name: "Dart", level: 4 },
    ],
  },
  {
    category: "Frameworks & Libraries",
    skills: [
      { name: "React", level: 5 },
      { name: "Next.js", level: 4 },
      { name: "Tailwind CSS", level: 5 },
      { name: "Flutter", level: 4 },
    ],
  },
  {
    category: "Tools & Design",
    skills: [
      { name: "UI / UX Design", level: 4 },
      { name: "Procreate", level: 5 },
      { name: "Adobe Photoshop", level: 4 },
      { name: "Git & GitHub", level: 4 },
    ],
  },
  {
    category: "Others",
    skills: [
      { name: "RESTful APIs", level: 4 },
      { name: "Firebase", level: 4 },
      { name: "MongoDB", level: 4 },
      { name: "AI Integration", level: 4 },
    ],
  },
];

type CategoryTheme = {
  icon: React.ReactNode;
  headerBg: string;
  accentColor: string;
  progressColor: string;
  badgeBg: string;
};

const getCategoryTheme = (category: string): CategoryTheme => {
  switch (category) {
    case "Languages":
      return {
        icon: <Terminal className="w-5 h-5 text-amber-600" />,
        headerBg: "bg-amber-50 border-amber-200",
        accentColor: "text-amber-600",
        progressColor: "bg-amber-500",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "Frameworks & Libraries":
      return {
        icon: <Code2 className="w-5 h-5 text-raspberry" />,
        headerBg: "bg-rose-50 border-rose-100",
        accentColor: "text-raspberry",
        progressColor: "bg-raspberry",
        badgeBg: "bg-rose-50 text-raspberry border-rose-100",
      };
    case "Tools & Design":
      return {
        icon: <Paintbrush className="w-5 h-5 text-black" />,
        headerBg: "bg-gray-50 border-gray-200",
        accentColor: "text-black",
        progressColor: "bg-black",
        badgeBg: "bg-gray-50 text-black border-gray-200",
      };
    default:
      return {
        icon: <Layers className="w-5 h-5 text-emerald-700" />,
        headerBg: "bg-emerald-50 border-emerald-100",
        accentColor: "text-emerald-700",
        progressColor: "bg-emerald-600",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-100",
      };
  }
};

export default function Skills() {
  return (
    <section id="skills" className="py-section bg-gray-50 border-t border-gray-100">
      <div className="max-w-screen-lg mx-auto px-8">
        {/* Section heading */}
        <div className="mb-16">
          <span className="font-mono text-xs text-gray-400 uppercase tracking-widest block mb-2">
            Technical Core
          </span>
          <h1 className="md:text-7xl text-6xl uppercase tracking-tight text-black">
            Skills
          </h1>
          {/* Pink underline accent */}
          <div className="mt-2 h-1 w-16 bg-raspberry" />
        </div>

        {/* 2×2 Bento skill grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillGroups.map((group) => {
            const theme = getCategoryTheme(group.category);
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-8 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Category header */}
                <div
                  className={`flex items-center justify-between p-3.5 mb-6 border ${theme.headerBg}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white shadow-sm">{theme.icon}</div>
                    <span className="text-sm font-bold text-black uppercase tracking-wide">
                      {group.category}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold uppercase py-0.5 px-2 bg-white border ${theme.accentColor}`}
                  >
                    {group.skills.length} skills
                  </span>
                </div>

                {/* Skill list with progress bars */}
                <div className="flex flex-col gap-5">
                  {group.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle
                            className={`w-4 h-4 ${theme.accentColor} opacity-75`}
                          />
                          <span className="text-sm font-bold text-black">
                            {skill.name}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border uppercase tracking-wider ${theme.badgeBg}`}
                        >
                          {skill.level * 20}%
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level * 20}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                          className={`h-full ${theme.progressColor}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dark editorial summary panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12">
          {/* Left: dark panel */}
          <div className="lg:col-span-8 p-8 bg-black text-white flex flex-col justify-between relative overflow-hidden">
            {/* Ghost background text */}
            <span className="absolute right-0 bottom-0 text-[180px] font-black leading-none text-white/5 pointer-events-none select-none translate-y-12 translate-x-8">
              JS
            </span>
            <div className="relative z-10">
              <span className="font-mono text-[10px] uppercase text-raspberry font-bold tracking-widest block mb-1">
                Interactive Focus
              </span>
              <h3 className="text-xl md:text-2xl font-black tracking-tight mb-4 uppercase text-white">
                Modern Web & App Stack
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xl">
                My build pipeline is centred on React and Next.js for web, and
                Flutter & Dart for cross-platform apps. Every interaction is
                considered — from server-side architecture to the
                micro-animations users feel but rarely notice.
              </p>
            </div>
            <div className="mt-8 flex gap-2.5 flex-wrap relative z-10 select-none">
              {["TypeScript", "Tailwind CSS", "Next.js 14", "Flutter"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 font-mono text-[10px] uppercase bg-white/5 text-gray-300 font-bold border border-white/10"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Right: light panel */}
          <div className="lg:col-span-4 p-8 bg-white border border-gray-200 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase text-gray-400 tracking-widest block mb-1">
                Visual Design
              </span>
              <h3 className="text-xl font-bold text-black mb-3 uppercase">
                Art meets Code
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                Using Procreate and Photoshop I illustrate layouts, create
                custom assets, and prepare visual concepts before writing a
                single line of CSS. Design and development are never separate
                disciplines.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-gray-500 uppercase">
                  Design Integration
                </span>
                <span className="text-raspberry font-bold uppercase">
                  100% Native
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
