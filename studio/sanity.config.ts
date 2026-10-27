import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { projectId, dataset } from './env';
import { schemaTypes } from './schemas';

const LIST = [['scenario', 'Scenarios'], ['skill', 'Skills'], ['rule', 'Rules'], ['author', 'Authors']] as const;

export default defineConfig({
  name: 'default',
  title: 'B2B AI Standard',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure: (S) => S.list().title('Directory').items(LIST.map(([type, title]) => S.documentTypeListItem(type).title(title))) }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
