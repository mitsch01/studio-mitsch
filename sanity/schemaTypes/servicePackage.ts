import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

export const servicePackage = defineType({
  name: 'servicePackage',
  title: 'Leistungspaket',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Preis (€)',
      type: 'number',
      description: 'Endpreis als Zahl, z. B. 1400 — „ab“ und „€“ ergänzt die Website',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'priceFrom',
      title: 'Ab-Preis',
      type: 'boolean',
      description: 'Zeigt „ab“ vor dem Preis an',
      initialValue: false,
    }),
    defineField({
      name: 'unit',
      title: 'Einheit',
      type: 'localizedString',
      description: 'z. B. „einmalig“ / „one-time“ oder „pro Monat“ / „per month“',
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'localizedText',
    }),
    defineField({
      name: 'features',
      title: 'Leistungen',
      type: 'array',
      of: [{ type: 'localizedString' }],
    }),
    defineField({
      name: 'note',
      title: 'Hinweis',
      type: 'localizedText',
      description: 'Kleingedrucktes unter den Leistungen, z. B. Anrechnung oder Optionen',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button-Text',
      type: 'localizedString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Hervorgehoben',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'localizedString',
      description: 'z. B. „Empfohlen“ / „Recommended“ — nur bei hervorgehobenen Paketen',
      hidden: ({ document }) => !document?.featured,
    }),
    orderRankField({ type: 'servicePackage' }),
  ],
  preview: {
    select: { title: 'title.de', price: 'price', priceFrom: 'priceFrom', featured: 'featured' },
    prepare({ title, price, priceFrom, featured }) {
      return {
        title,
        subtitle: `${priceFrom ? 'ab ' : ''}${price ?? '–'} €${featured ? ' · hervorgehoben' : ''}`,
      }
    },
  },
})
