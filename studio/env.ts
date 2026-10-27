// Project id is public (it sits in every API URL); set SANITY_STUDIO_PROJECT_ID once the project exists
export const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'REPLACE_ME';
export const dataset = process.env.SANITY_STUDIO_DATASET || 'production';
