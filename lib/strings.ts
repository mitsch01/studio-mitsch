import type { Locale } from "@/lib/locale";

export const strings: Record<Locale, {
  nav: Record<"home" | "about" | "projects" | "blog" | "shop" | "playground" | "contact", string>;
  common: Record<"readMore" | "backToArticles" | "addToCart" | "subscribe" | "submit" | "myAccount" | "login" | "cart" | "openMenu" | "closeMenu", string>;
  footer: Record<"tagline" | "navigate" | "newsletterHeading" | "newsletterBody" | "copyright" | "builtWith", string>;
  newsletter: Record<"placeholder" | "subscribing" | "success" | "duplicate" | "error", string>;
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
  },
} as const;

export function getStrings(locale: Locale) {
  return strings[locale];
}