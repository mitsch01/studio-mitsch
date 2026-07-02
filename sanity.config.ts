import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'studio-mitsch',
  title: 'Studio Mitsch',
  projectId: 'v6oxqy1t',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Content')
              .id('siteContent')
              .child(
                S.document()
                  .schemaType('siteContent')
                  .documentId('siteContent')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== 'siteContent'
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})