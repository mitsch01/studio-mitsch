import { client } from "@/sanity/client"

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
      "Fullstack Development", "Frontend Development", "App Development",
      "HTML & CSS", "JavaScript", "TypeScript", "React", "Next.js",
      "Flutter", "Dart", "UI / UX", "Tailwind CSS", "Procreate", "Photoshop",
    ],
  },
  contact: {
    contactIntro:
      "Got a project in mind, a question, or just want to say hello? I'm always happy to hear from people who care about good design and thoughtful builds. Drop me a message below or find me on social media — I'll get back to you.",
  },
  skills: {
    skillGroups: [
      { category: "Languages", skills: [
        { name: "JavaScript", level: 5 }, { name: "TypeScript", level: 4 },
        { name: "HTML5 & CSS3", level: 5 }, { name: "Dart", level: 4 },
      ]},
      { category: "Frameworks & Libraries", skills: [
        { name: "React", level: 5 }, { name: "Next.js", level: 4 },
        { name: "Tailwind CSS", level: 5 }, { name: "Flutter", level: 4 },
      ]},
      { category: "Tools & Design", skills: [
        { name: "UI / UX Design", level: 4 }, { name: "Procreate", level: 5 },
        { name: "Adobe Photoshop", level: 4 }, { name: "Git & GitHub", level: 4 },
      ]},
      { category: "Others", skills: [
        { name: "RESTful APIs", level: 4 }, { name: "Firebase", level: 4 },
        { name: "MongoDB", level: 4 }, { name: "AI Integration", level: 4 },
      ]},
    ],
    stackHeading: "Modern Web & App Stack",
    stackBody:
      "My build pipeline is centred on React and Next.js for web, and Flutter & Dart for cross-platform apps. Every interaction is considered — from server-side architecture to the micro-animations users feel but rarely notice.",
    stackTags: ["TypeScript", "Tailwind CSS", "Next.js 14", "Flutter"],
    artMeetsCodeBody:
      "Using Procreate and Photoshop I illustrate layouts, create custom assets, and prepare visual concepts before writing a single line of CSS. Design and development are never separate disciplines.",
  },
}

export async function getSiteContent(): Promise<SiteContent> {
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