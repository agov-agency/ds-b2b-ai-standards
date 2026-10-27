// Connector logo: a tile per brand logo in design-system/logos (the set the site draws); empty = upload your own below
import { Card, Grid, Text } from '@sanity/ui';
import { set, unset, type StringInputProps } from 'sanity';

const raw = import.meta.glob('../../design-system/logos/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const LOGOS = Object.entries(raw).map(([p, svg]) => [p.split('/').pop()!.slice(0, -4), svg] as const);

export function LogoInput({ value, onChange }: StringInputProps) {
  const tile = (name: string | undefined, body: React.ReactNode) => (
    <Card key={name ?? ''} as="button" type="button" title={name ?? 'Own logo'} onClick={() => onChange(name ? set(name) : unset())} padding={2} radius={2} border tone={value === name ? 'primary' : 'default'}
      style={{ cursor: 'pointer', aspectRatio: '1', background: '#fff', display: 'grid', placeItems: 'center', outline: value === name ? '2px solid var(--card-focus-ring-color)' : undefined }}>
      {body}
    </Card>
  );
  return (
    <Grid columns={[5, 7, 9]} gap={2}>
      {tile(undefined, <Text muted size={0}>Own</Text>)}
      {LOGOS.map(([name, svg]) => tile(name, <span style={{ width: 24, height: 24, display: 'block' }} dangerouslySetInnerHTML={{ __html: svg.replace('<svg', '<svg width="24" height="24"') }} />))}
    </Grid>
  );
}
