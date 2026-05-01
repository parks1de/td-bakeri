import { defineField, defineType } from "sanity";

const DAYS = [
  { title: "Måndag", value: "mandag" },
  { title: "Tysdag", value: "tirsdag" },
  { title: "Onsdag", value: "onsdag" },
  { title: "Torsdag", value: "torsdag" },
  { title: "Fredag", value: "fredag" },
  { title: "Laurdag", value: "lordag" },
  { title: "Sundag", value: "sondag" },
];

export const hoursConfig = defineType({
  name: "hoursConfig",
  title: "Opningstider",
  type: "document",
  fields: [
    defineField({
      name: "manualOverride",
      title: "Manuell overstyring",
      description: "Overstyrer dei vanlege opningstidene umiddelbart. Nyttig når butikken opnar/stengjer utanfor normaltid.",
      type: "string",
      options: {
        list: [
          { title: "Auto — følg vanlege opningstider", value: "auto" },
          { title: "Tving OPEN — uansett kva klokka er", value: "open" },
          { title: "Tving STENGT — uansett kva klokka er", value: "closed" },
        ],
        layout: "radio",
      },
      initialValue: "auto",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "schedule",
      title: "Vanlege opningstider",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "day",
              title: "Dag",
              type: "string",
              options: { list: DAYS },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "isClosed",
              title: "Stengt denne dagen",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "openTime",
              title: "Opnar (HH:MM)",
              type: "string",
              initialValue: "09:00",
              hidden: ({ parent }) => parent?.isClosed === true,
            }),
            defineField({
              name: "closeTime",
              title: "Stengjer (HH:MM)",
              type: "string",
              initialValue: "18:00",
              hidden: ({ parent }) => parent?.isClosed === true,
            }),
          ],
          preview: {
            select: {
              day: "day",
              isClosed: "isClosed",
              openTime: "openTime",
              closeTime: "closeTime",
            },
            prepare({
              day,
              isClosed,
              openTime,
              closeTime,
            }: {
              day?: string;
              isClosed?: boolean;
              openTime?: string;
              closeTime?: string;
            }) {
              const label = DAYS.find((d) => d.value === day)?.title ?? day ?? "";
              return {
                title: label,
                subtitle: isClosed ? "Stengt" : `${openTime ?? "?"} – ${closeTime ?? "?"}`,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { manualOverride: "manualOverride" },
    prepare({ manualOverride }: { manualOverride?: string }) {
      const label =
        manualOverride === "open"
          ? "Tving OPEN"
          : manualOverride === "closed"
          ? "Tving STENGT"
          : "Auto";
      return { title: "Opningstider", subtitle: label };
    },
  },
});
