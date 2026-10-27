import { defineField, defineType } from 'sanity';

// Logo for a connector the site doesn't know yet (e.g. Google Ads). Matches any connector tag that contains the name.
export const connector = defineType({
  name: 'connector', type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required(), description: 'e.g. “Google Ads”: also matches the tag “Google Ads export”' }),
    defineField({ name: 'logo', type: 'image', validation: (r) => r.required(), description: 'Square SVG or PNG in brand colours, shown 18px on a white disc' }),
  ],
  preview: { select: { title: 'name', media: 'logo' } },
});
