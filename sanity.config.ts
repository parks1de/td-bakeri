import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "td-bakeri",
  title: "T&D Bakeri",
  projectId: "u7hre29r",
  dataset: "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Innhald")
          .items([
            S.listItem()
              .title("Kategoriar")
              .id("category")
              .child(S.documentTypeList("category").title("Kategoriar")),
            S.listItem()
              .title("Menyprodukt")
              .id("menuItem")
              .child(S.documentTypeList("menuItem").title("Menyprodukt")),
            S.divider(),
            S.listItem()
              .title("Opningstider")
              .id("hoursConfig")
              .child(
                S.document()
                  .schemaType("hoursConfig")
                  .documentId("singleton-hoursConfig")
                  .title("Opningstider")
              ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
