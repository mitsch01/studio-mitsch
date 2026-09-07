import type { Locale } from "@/lib/locale";
import { client } from "@/sanity/client";

export type SkillItem = { name: string; level: number }
export type SkillGroup = { category: string; skills: SkillItem[] }

export type SiteContent = {
  about: {
    bioHeading: string
    bioParagraph1: string
    bioParagraph2: string
    bioParagraph3: string
    availabilityStatus: string
    skillBadges: string[]
  }
  contact: {
    contactIntro: string
  }
  skills: {
    skillGroups: SkillGroup[]
    stackHeading: string
    stackBody: string
    stackTags: string[]
    artMeetsCodeBody: string
  }
}

const defaultSiteContent: SiteContent = {
  about: {
    bioHeading: "Hi, I'm Miriam",
    bioParagraph1:
      "I'm a frontend web and app developer from Hamburg with a thing for design, details, and the space where code meets craft. I build responsive websites and apps that feel as good as they look — technically solid, visually considered, and shaped around the people and projects behind them.",
    bioParagraph2:
      "My background in art and design isn't just a hobby footnote. It influences how I think about layouts, colour, and the small decisions that make a digital product feel intentional rather than assembled.",
    bioParagraph3:
      "When I'm not coding, you'll find me in my art studio, out on my bike or in my garden enjoying the fresh air and colours of nature.",
    availabilityStatus: "Available for Freelance",
    skillBadges: [
      "AI-Assisted Coding", "AI Integration", "App Development", "Canva", "Cloudflare R2",
      "Dart", "Figma", "Firebase", "Flutter", "Framer Motion", "Frontend Development",
      "Fullstack Development", "Git", "GitHub", "HTML & CSS", "JavaScript", "MongoDB",
      "Next.js", "Node.js", "Photoshop", "Procreate", "React", "Resend",
      "RESTful APIs", "Sanity Studio", "Strapi CMS", "Tailwind CSS", "TypeScript",
      "UI / UX", "Vercel", "Vite", "WCAG / Accessibility"
    ],
  },
  contact: {
    contactIntro:
      "Got a project in mind, a question, or just want to say hello? I'm always happy to hear from people who care about good design and thoughtful builds. Drop me a message below or find me on social media — I'll get back to you.",
  },
  skills: {
    skillGroups: [
      {
        category: "Languages", skills: [
          { name: "JavaScript", level: 5 }, { name: "TypeScript", level: 4 },
          { name: "HTML5 & CSS3", level: 5 }, { name: "Dart", level: 4 },
        ]
      },
      {
        category: "Frameworks & Libraries", skills: [
          { name: "React", level: 5 }, { name: "Next.js", level: 4 },
          { name: "Vite", level: 4 }, { name: "Tailwind CSS", level: 5 },
          { name: "Framer Motion", level: 4 }, { name: "Flutter", level: 4 },
        ]
      },
      {
        category: "Backend, CMS & Data", skills: [
          { name: "Node.js", level: 3 }, { name: "Sanity Studio", level: 5 },
          { name: "Strapi CMS", level: 3 }, { name: "RESTful APIs", level: 4 },
          { name: "MongoDB", level: 4 }, { name: "Firebase", level: 4 },
          { name: "AI Integration", level: 4 },
        ]
      },
      {
        category: "Tools, Design & Deployment", skills: [
          { name: "Figma", level: 4 }, { name: "UI / UX Design", level: 4 },
          { name: "Procreate", level: 5 },
          { name: "Git & GitHub", level: 4 }, { name: "Vercel", level: 4 },
          { name: "Cloudflare R2", level: 3 }, { name: "Resend", level: 3 },
          { name: "WCAG / Accessibility", level: 3 },
        ]
      },
    ],
    stackHeading: "Modern Web & App Stack",
    stackBody:
      "My current build pipeline centers on React 19 with TypeScript — paired with Next.js or Vite depending on the project's needs — styled with Tailwind CSS and brought to life with Framer Motion's micro-animations, with Sanity as headless CMS for content that clients manage themselves.",
    stackTags: ["TypeScript", "React 19", "Next.js", "Vite", "Tailwind CSS", "Framer Motion", "Sanity"],
    artMeetsCodeBody:
      "Using Figma, Procreate and Photoshop I build wireframes, illustrate layouts, create custom assets, and prepare visual concepts before writing a single line of CSS. Design and development are never separate disciplines.",
  },
}

export async function getSiteContent(locale: Locale = "de"): Promise<SiteContent> {
  const data = await client.fetch<Partial<SiteContent> | null>(
    `*[_id == "siteContent"][0]{ about, contact, skills }`,
    {},
    { cache: "no-store" }
  )

  if (!data) return defaultSiteContent

  return {
    about: { ...defaultSiteContent.about, ...data.about },
    contact: { ...defaultSiteContent.contact, ...data.contact },
    skills: { ...defaultSiteContent.skills, ...data.skills },
  }
}