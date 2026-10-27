// Cover colour: a swatch per --pastel-N token, read from the shared tokens so the picker matches the site
import { Card, Grid, Text } from '@sanity/ui';
import { set, unset, type NumberInputProps } from 'sanity';
import tokens from '../../design-system/tokens.css?raw';

const PASTELS = [...tokens.matchAll(/--pastel-(\d+):\s*(#[0-9a-f]{6})/gi)].map(([, n, hex]) => [Number(n), hex] as const);

export function CoverInput({ value, onChange }: NumberInputProps) {
  return (
    <Grid columns={[5, 10]} gap={2}>
      {PASTELS.map(([n, hex]) => (
        <Card key={n} as="button" type="button" title={`--pastel-${n}`} onClick={() => onChange(value === n ? unset() : set(n))} radius={2} border
          style={{ cursor: 'pointer', aspectRatio: '1', background: hex, display: 'grid', placeItems: 'center', outline: value === n ? '2px solid var(--card-focus-ring-color)' : undefined, outlineOffset: 2 }}>
          <Text size={0} style={{ color: '#404040' }}>{n}</Text>
        </Card>
      ))}
    </Grid>
  );
}
