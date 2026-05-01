import { defineField, defineType } from "sanity";

const ALLERGENS = [
  { title: "Gluten", value: "Gluten" },
  { title: "Melk", value: "Melk" },
  { title: "Egg", value: "Egg" },
  { title: "Nøtter", value: "Notter" },
  { title: "Soya", value: "Soya" },
  { title: "Sesam", value: "Sesam" },
  { title: "Fisk", value: "Fisk" },
  { title: "Skalldyr", value: "Skalldyr" },
  { title: "Selleri", value: "Selleri" },
  { title: "Sennep", value: "Sennep" },
  { title: "Sulfitt", value: "Sulfitt" },
];

export const menuItem = defineType({
  name: "menuItem",
  title: "Menyprodukt",
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
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskriving",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "price",
      title: "Pris (kr)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "image",
      title: "Bilete",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "allergies",
      title: "Allergener",
      type: "array",
      of: [{ type: "string" }],
      options: { list: ALLERGENS },
    }),
    defineField({
      name: "variants",
      title: "Variantar",
      type: "array",
      of: [{ type: "string" }],
      description: "Td. «Liten (6 pers)», «Medium (10 pers)»",
    }),
    defineField({
      name: "available",
      title: "Tilgjengeleg i menyen",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "eatIn",
      title: "Spis her",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "takeAway",
      title: "Ta med / Henting",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "featured",
      title: "Framheva på forsida",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      price: "price",
      media: "image",
    },
    prepare({ title, category, price, media }) {
      return {
        title,
        subtitle: `${category ?? "Utan kategori"} · ${price ?? 0} kr`,
        media,
      };
    },
  },
});
