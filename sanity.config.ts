import { documentInternationalization } from '@sanity/document-internationalization'
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
                S.list()
                  .title('Site Content')
                  .items([
                    S.listItem()
                      .title('DE')
                      .child(
                        S.document()
                          .schemaType('siteContent')
                          .documentId('siteContent-de')
                      ),
                    S.listItem()
                      .title('EN')
                      .child(
                        S.document()
                          .schemaType('siteContent')
                          .documentId('siteContent-en')
                      ),
                  ])
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== 'siteContent'
            ),
          ]),
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        { id: 'de', title: 'Deutsch' },
        { id: 'en', title: 'English' },
      ],
      schemaTypes: ['post', 'product'],
    }),
  ],
  schema: { types: schemaTypes },
})