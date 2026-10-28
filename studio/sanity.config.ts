import { createElement } from 'react';
import { defineConfig } from 'sanity';
import mark from '../design-system/brand/mark.svg?raw';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { projectId, dataset } from './env';
import { schemaTypes } from './schemas';

const LIST = [['scenario', 'Scenarios'], ['skill', 'Skills'], ['rule', 'Rules'], ['author', 'Authors']] as const;
const LISTS = [['category', 'Categories'], ['cadence', 'Cadences'], ['connector', 'Connectors']] as const;

export default defineConfig({
  name: 'default',
  title: 'B2B AI Standard',
  icon: () => createElement('span', { dangerouslySetInnerHTML: { __html: mark.replace('width="80" height="80"', 'width="100%" height="100%"') }, style: { display: 'block', width: '100%', height: '100%' } }),
  projectId,
  dataset,
  plugins: [
    structureTool({ structure: (S) => S.list().title('Directory').items([...LIST.map(([type, title]) => S.documentTypeListItem(type).title(title)), S.divider(), ...LISTS.map(([type, title]) => S.documentTypeListItem(type).title(title))]) }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
