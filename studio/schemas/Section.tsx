// Form hierarchy: level 1 = the page's big parts (Hero, Page sections, Settings), level 2 = one section of the page.
// A heavier title with a rule above it, then the field's own input; fields inside keep Sanity's default look.
// Plain elements, not Sanity UI Heading/Text: their cap-height trimming made big titles overlap the description.
import { Stack } from '@sanity/ui';
import type { FieldProps } from 'sanity';

const make = (level: 1 | 2) => function Section(props: FieldProps) {
  const Tag = level === 1 ? 'h2' : 'h3';
  return (
    <Stack space={4} style={{ marginTop: level === 1 ? 32 : 12, paddingTop: level === 1 ? 32 : 20, borderTop: `${level === 1 ? 2 : 1}px solid var(--card-border-color)` }}>
      <div>
        <Tag style={{ margin: 0, fontSize: level === 1 ? 28 : 19, lineHeight: 1.2, fontWeight: 700, color: 'var(--card-fg-color)' }}>{props.title}</Tag>
        {props.description && <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.45, color: 'var(--card-muted-fg-color)' }}>{props.description}</p>}
      </div>
      {props.children}
    </Stack>
  );
};
export const Part = make(1);
export const SectionTitle = make(2);
