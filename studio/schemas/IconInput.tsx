// Skill card icon: a tile per line icon in illustrations/icons; empty = the area's default icon
import { Card, Grid, Text } from '@sanity/ui';
import { set, unset, type StringInputProps } from 'sanity';

const raw = import.meta.glob('../../illustrations/icons/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
// Same palette the site maps onto the icons (site/src/styles/site.css, .hl)
const CSS = `.ic path,.ic polygon,.ic ellipse,.ic line{fill:#fff;stroke:#d4d4d4;stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.ic .nf{fill:none}.ic .fo{stroke:none}.ic .sil{stroke:#262626}.ic .hi{stroke:#3b6cff}.ic .lo{stroke:#f0f0f0}.ic .dash{stroke-dasharray:1 3}
.ic .dot{stroke:none;fill:#3b6cff}.ic .dot.m{fill:#262626}.ic .dot.off{fill:#e5e5e5}`;
const ICONS = Object.entries(raw).map(([p, svg]) => [p.split('/').pop()!.slice(0, -4), svg] as const);

export function IconInput({ value, onChange }: StringInputProps) {
  const tile = (name: string | undefined, body: React.ReactNode) => (
    <Card key={name ?? ''} as="button" type="button" title={name ?? 'Area default'} onClick={() => onChange(name ? set(name) : unset())} padding={2} radius={2} border tone={value === name ? 'primary' : 'default'}
      style={{ cursor: 'pointer', aspectRatio: '1', background: '#fff', display: 'grid', placeItems: 'center', outline: value === name ? '2px solid var(--card-focus-ring-color)' : undefined }}>
      {body}
    </Card>
  );
  return (
    <Grid columns={[4, 6, 8]} gap={2}>
      <style>{CSS}</style>
      {tile(undefined, <Text muted size={0}>Area</Text>)}
      {ICONS.map(([name, svg]) => tile(name, <span className="ic" style={{ width: 40, height: 40, display: 'block' }} dangerouslySetInnerHTML={{ __html: svg.replace('<svg', '<svg width="40" height="40"') }} />))}
    </Grid>
  );
}
