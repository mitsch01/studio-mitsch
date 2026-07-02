import { defineField, defineType } from "sanity";

export const siteContent = defineType({
  name: "siteContent",
  title: "Site Content",
  type: "document",
  fields: [
    defineField({
      name: "about",
      title: "About Section",
      type: "object",
      fields: [
        defineField({ name: "bioHeading", title: "Bio Heading", type: "string" }),
        defineField({ name: "bioParagraph1", title: "Bio Paragraph 1", type: "text", rows: 3 }),
        defineField({ name: "bioParagraph2", title: "Bio Paragraph 2", type: "text", rows: 3 }),
        defineField({ name: "bioParagraph3", title: "Bio Paragraph 3", type: "text", rows: 3 }),
        defineField({ name: "availabilityStatus", title: "Availability Status", type: "string" }),
        defineField({
          name: "skillBadges",
          title: "Skill Badges",
          type: "array",
          of: [{ type: "string" }],
        }),
      ],
    }),
    defineField({
      name: "contact",
      title: "Contact Section",
      type: "object",
      fields: [
        defineField({ name: "contactIntro", title: "Contact Intro", type: "text", rows: 4 }),
      ],
    }),
    defineField({
      name: "skills",
      title: "Skills Section",
      type: "object",
      fields: [
        defineField({
          name: "skillGroups",
          title: "Skill Groups",
          type: "array",
          of: [
            {
              type: "object",
              name: "skillGroup",
              fields: [
                defineField({ name: "category", title: "Category", type: "string" }),
                defineField({
                  name: "skills",
                  title: "Skills",
                  type: "array",
                  of: [
                    {
                      type: "object",
                      name: "skill",
                      fields: [
                        defineField({ name: "name", title: "Name", type: "string" }),
                        defineField({
                          name: "level",
                          title: "Level (1–5)",
                          type: "number",
                          validation: (Rule) => Rule.min(1).max(5),
                        }),
                      ],
                      preview: {
                        select: { title: "name", subtitle: "level" },
                        prepare({ title, subtitle }) {
                          return { title, subtitle: subtitle ? `Level ${subtitle}` : undefined };
                        },
                      },
                    },
                  ],
                }),
              ],
              preview: { select: { title: "category" } },
            },
          ],
        }),
        defineField({ name: "stackHeading", title: "Stack Heading", type: "string" }),
        defineField({ name: "stackBody", title: "Stack Body", type: "text", rows: 4 }),
        defineField({
          name: "stackTags",
          title: "Stack Tags",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "artMeetsCodeBody", title: "Art Meets Code Body", type: "text", rows: 4 }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Content" };
    },
  },
});