import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Kategori",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskriving",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "icon",
      title: "Ikon (emoji)",
      type: "string",
      description: "Emoji som representerer kategorien, td. 🎂",
    }),
    defineField({
      name: "sortOrder",
      title: "Rekkefølgje",
      type: "number",
      initialValue: 0,
      description: "Lågt tal kjem fyrst i menyen",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description", icon: "icon" },
    prepare({ title, subtitle, icon }) {
      return { title: `${icon ?? ""} ${title}`.trim(), subtitle };
    },
  },
});
