import { defineCliConfig } from 'sanity/cli';
import { projectId, dataset } from './env';

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: 'ds-b2b-ai-standards',
  deployment: { autoUpdates: false },
  // The art picker imports the site's pieces (../site/src/art), outside this folder
  vite: (config) => ({ ...config, server: { ...config.server, fs: { allow: ['..'] } } }),
});
