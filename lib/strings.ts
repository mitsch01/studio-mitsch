export const locales = ["de", "en"] as const;
export type Locale = (typeof locales)[number];

export const strings = {
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
    },
    footer: {
      copyright: "Alle Rechte vorbehalten.",
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
    },
    footer: {
      copyright: "All rights reserved.",
    },
  },
} as const;

export function getStrings(locale: Locale) {
  return strings[locale];
}