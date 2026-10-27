// Cover colour: a dropdown of the --pastel-N tokens (read from the shared tokens, so it matches the site) with a swatch of the pick
import { Flex, Select } from '@sanity/ui';
import { set, unset, type NumberInputProps } from 'sanity';
import tokens from '../../design-system/tokens.css?raw';

const PASTELS = [...tokens.matchAll(/--pastel-(\d+):\s*(#[0-9a-f]{6})/gi)].map(([, n, hex]) => [Number(n), hex] as const);
// Hue names for the 20 palette columns (Figma 1049:34720), so the list reads as colours, not numbers
const NAMES = ['Rose', 'Red', 'Coral', 'Orange', 'Amber', 'Gold', 'Lemon', 'Lime', 'Green', 'Mint', 'Aqua', 'Cyan', 'Sky', 'Azure', 'Cornflower', 'Blue', 'Indigo', 'Violet', 'Orchid', 'Pink'];
export const randomCover = () => 1 + Math.floor(Math.random() * PASTELS.length);

export function CoverInput({ value, onChange }: NumberInputProps) {
  const hex = PASTELS.find(([n]) => n === value)?.[1];
  return (
    <Flex gap={2} align="center">
      <span style={{ width: 35, height: 35, flex: 'none', borderRadius: 4, background: hex ?? 'transparent', boxShadow: 'inset 0 0 0 1px var(--card-border-color)' }} />
      <Select value={value ?? ''} onChange={(e) => onChange(e.currentTarget.value ? set(Number(e.currentTarget.value)) : unset())}>
        <option value="">None (neutral)</option>
        {PASTELS.map(([n]) => <option key={n} value={n}>{NAMES[n - 1] ?? n} · {n}</option>)}
      </Select>
    </Flex>
  );
}
