import type { Locale } from "@/lib/locale";

export const strings: Record<Locale, {
  nav: Record<"home" | "about" | "projects" | "blog" | "shop" | "playground" | "contact", string>;
  common: Record<"readMore" | "backToArticles" | "addToCart" | "subscribe" | "submit" | "myAccount" | "login" | "cart" | "openMenu" | "closeMenu", string>;
  footer: Record<"tagline" | "navigate" | "newsletterHeading" | "newsletterBody" | "copyright" | "builtWith", string>;
  newsletter: Record<"placeholder" | "subscribing" | "success" | "duplicate" | "error", string>;
  projects: Record<"heading" | "unavailable" | "loadMore" | "close" | "noDescription" | "languages" | "tags" | "none" | "created" | "updated" | "viewOnGitHub", string>;
  playground: Record<"tooltip", string>;
  hero: Record<"alt", string>;
  meta: Record<"homeDescription" | "blogDescription", string>;
  blog: Record<"heading" | "noPosts" | "readMore" | "backToArticles" | "dateLocale", string>;
  contact: Record<"heading" | "imageAlt" | "descriptionMeta", string>;
  form: Record<"name" | "email" | "message" | "sending" | "send" | "success" | "error", string>;
}> = {
  de: {
    nav: {
      home: "Home",
      about: "Über mich",
      projects: "Projekte",
      blog: "Blog",
      shop: "Shop",
      playground: "Playground",
      contact: "Kontakt",
    },
    common: {
      readMore: "Weiterlesen →",
      backToArticles: "← Alle Artikel",
      addToCart: "In den Warenkorb",
      subscribe: "Abonnieren",
      submit: "Senden",
      myAccount: "Mein Konto",
      login: "Anmelden",
      cart: "Warenkorb",
      openMenu: "Menü öffnen",
      closeMenu: "Menü schließen",
    },
    footer: {
      tagline: "Frontend Web- & App-Entwicklung aus Hamburg — Code trifft Kunst.",
      navigate: "Navigation",
      newsletterHeading: "Bleib auf dem Laufenden",
      newsletterBody: "Gelegentliche Updates über Projekte und Neuigkeiten aus dem Studio.",
      copyright: "Alle Rechte vorbehalten.",
      builtWith: "Gebaut mit Next.js · Gehostet auf Vercel",
    },
    newsletter: {
      placeholder: "deine@email.de",
      subscribing: "...",
      success: "Du bist dabei — willkommen!",
      duplicate: "Du bist bereits angemeldet.",
      error: "Etwas ist schiefgelaufen — bitte versuch es erneut.",
    },
    projects: {
      heading: "Projekte",
      unavailable: "Projekte gerade nicht verfügbar — schau bald wieder vorbei.",
      loadMore: "Mehr laden",
      close: "Schließen",
      noDescription: "Keine Beschreibung vorhanden.",
      languages: "Sprachen",
      tags: "Tags",
      none: "keine",
      created: "Erstellt",
      updated: "Aktualisiert",
      viewOnGitHub: "Auf GitHub ansehen ↗",
    },
    playground: {
      tooltip: "Schreib ein Gedicht",
    },
    hero: {
      alt: "Studio Mitsch — Webentwicklerin & App-Entwicklerin aus Hamburg",
    },
    meta: {
      homeDescription: "Portfolio von Miriam Schwartz — Fullstack-Entwicklerin aus Hamburg. Webentwicklung mit React & Next.js, App-Entwicklung mit Flutter & Dart.",
      blogDescription: "Gedanken über das Zusammenspiel von Webentwicklung und Design, wo Code auf Gestaltung trifft — von Miriam Schwartz.",
    },
    blog: {
      heading: "Blog",
      noPosts: "Noch keine Beiträge — schau bald wieder vorbei.",
      readMore: "Weiterlesen →",
      backToArticles: "← Alle Artikel",
      dateLocale: "de-DE",
    },
    contact: {
      heading: "Kontakt",
      imageAlt: "Kontakt — Studio Mitsch",
      descriptionMeta: "Nimm Kontakt mit Miriam Schwartz auf — für Freelance-Projekte in Web- und App-Entwicklung.",
    },
    form: {
      name: "Name",
      email: "E-Mail",
      message: "Nachricht",
      sending: "Wird gesendet...",
      send: "Nachricht senden",
      success: "Danke — ich melde mich bald bei dir.",
      error: "Etwas ist schiefgelaufen. Bitte versuch es erneut.",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      projects: "Projects",
      blog: "Blog",
      shop: "Shop",
      playground: "Playground",
      contact: "Contact",
    },
    common: {
      readMore: "Read more →",
      backToArticles: "← All Articles",
      addToCart: "Add to Cart",
      subscribe: "Subscribe",
      submit: "Send",
      myAccount: "My Account",
      login: "Login",
      cart: "Cart",
      openMenu: "Open Menu",
      closeMenu: "Close Menu",
    },
    footer: {
      tagline: "Frontend web & app development from Hamburg — where code meets craft.",
      navigate: "Navigate",
      newsletterHeading: "Stay in the loop",
      newsletterBody: "Occasional updates on projects and news from my studio.",
      copyright: "All rights reserved.",
      builtWith: "Built with Next.js · Deployed on Vercel",
    },
    newsletter: {
      placeholder: "your@email.com",
      subscribing: "...",
      success: "You're in — welcome!",
      duplicate: "You're already subscribed.",
      error: "Something went wrong — try again.",
    },
    projects: {
      heading: "Projects",
      unavailable: "Projects unavailable right now — check back soon.",
      loadMore: "Load More",
      close: "Close",
      noDescription: "No description available.",
      languages: "Languages",
      tags: "Tags",
      none: "none",
      created: "Created",
      updated: "Updated",
      viewOnGitHub: "View on GitHub ↗",
    },
    playground: {
      tooltip: "Write a poem",
    },
    hero: {
      alt: "Studio Mitsch — Hamburg based web and app developer",
    },
    meta: {
      homeDescription: "Portfolio of Miriam Schwartz — fullstack developer and app developer based in Hamburg. Web development with React & Next.js, app development with Flutter & Dart.",
      blogDescription: "Thoughts on web development, design, and the space where code meets craft — by Miriam Schwartz.",
    },
    blog: {
      heading: "Blog",
      noPosts: "No posts yet — check back soon.",
      readMore: "Read more →",
      backToArticles: "← All Articles",
      dateLocale: "en-GB",
    },
    contact: {
      heading: "Contact",
      imageAlt: "Contact — Studio Mitsch",
      descriptionMeta: "Get in touch with Miriam Schwartz for freelance web and app development projects.",
    },
    form: {
      name: "Name",
      email: "Email",
      message: "Message",
      sending: "Sending...",
      send: "Send Message",
      success: "Thank you — I'll get back to you soon.",
      error: "Something went wrong. Please try again.",
    },
  },
} as const;

export function getStrings(locale: Locale) {
  return strings[locale];
}