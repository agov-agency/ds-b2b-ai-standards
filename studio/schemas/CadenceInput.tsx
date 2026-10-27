// Cadence: pick a common one or type your own; the value stays a plain string, so the site reads it unchanged
import { useState } from 'react';
import { Select, Stack, TextInput } from '@sanity/ui';
import { set, unset, type StringInputProps } from 'sanity';

const PRESETS = ['Daily', 'Weekly', 'Monthly', 'Weekly + monthly', 'Quarterly'];

export function CadenceInput({ value, onChange }: StringInputProps) {
  const [custom, setCustom] = useState(!!value && !PRESETS.includes(value));
  return (
    <Stack space={2}>
      <Select value={custom ? 'custom' : value ?? ''} onChange={(e) => {
        const v = e.currentTarget.value;
        setCustom(v === 'custom');
        if (v !== 'custom') onChange(v ? set(v) : unset());
      }}>
        <option value="">Pick a cadence</option>
        {PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
        <option value="custom">Custom…</option>
      </Select>
      {custom && <TextInput value={value ?? ''} placeholder="e.g. Once, days 7 to 14" onChange={(e) => onChange(e.currentTarget.value ? set(e.currentTarget.value) : unset())} />}
    </Stack>
  );
}
