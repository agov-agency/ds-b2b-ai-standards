// Form hierarchy: level 1 = the page's big parts (Hero, Page sections, Settings), level 2 = one section of the page.
// A heavier title with a rule above it, then the field's own input; fields inside keep Sanity's default look.
import { Heading, Stack, Text } from '@sanity/ui';
import type { FieldProps } from 'sanity';

const make = (level: 1 | 2) => function Section(props: FieldProps) {
  return (
    <Stack space={4} style={{ marginTop: level === 1 ? 32 : 12, paddingTop: level === 1 ? 32 : 20, borderTop: `${level === 1 ? 2 : 1}px solid var(--card-border-color)` }}>
      <Stack space={3}>
        <Heading as={level === 1 ? 'h2' : 'h3'} size={level === 1 ? 4 : 2}>{props.title}</Heading>
        {props.description && <Text size={1} muted>{props.description}</Text>}
      </Stack>
      {props.children}
    </Stack>
  );
};
export const Part = make(1);
export const SectionTitle = make(2);
