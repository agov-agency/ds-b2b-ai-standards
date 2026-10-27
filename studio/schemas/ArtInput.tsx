// Figure picker with a live preview: renders the same draw(t) the site plays, so editors see what they pick
import { useEffect, useRef } from 'react';
import { Card, Flex, Select, Stack, Text } from '@sanity/ui';
import { set, unset, type ObjectInputProps } from 'sanity';
import { pieces } from '../../site/src/art';

const CSS = `.f{stroke:#0a0a0a;stroke-width:1.5}.paper{fill:#fff}.tint{fill:#dde8ff}.body{fill:#b8ceff}.blk,.head{fill:#0a0a0a}
.det{fill:none;stroke:#0a0a0a;stroke-width:1}.hl{fill:none;stroke:#3b6cff;stroke-width:1.5}.dashed{stroke-dasharray:4 3}.nofill{fill:none}
.dash{fill:none;stroke:#0a0a0a;stroke-width:2;stroke-dasharray:8 6}.lit .body{fill:#3b6cff}.type{fill:#fff;font:600 10px monospace}
*{vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}`;

function Preview({ name }: { name: string }) {
  const g = useRef<SVGGElement>(null);
  const piece = pieces[name];
  useEffect(() => {
    if (!piece || !g.current) return;
    let raf = 0; const t0 = performance.now();
    const tick = (now: number) => { g.current!.innerHTML = piece.draw(piece.rest + (now - t0) / 1000 * 0.6); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [piece]);
  if (!piece) return <Text muted size={1}>No figure called “{name}” in site/src/art</Text>;
  return <svg viewBox={piece.viewBox} style={{ width: '100%', maxHeight: 320 }}><style>{CSS}</style><g ref={g} /></svg>;
}

export function ArtInput(props: ObjectInputProps) {
  const piece = (props.value as { piece?: string } | undefined)?.piece;
  return (
    <Stack space={3}>
      <Select value={piece ?? ''} onChange={(e) => props.onChange(e.currentTarget.value ? set(e.currentTarget.value, ['piece']) : unset())}>
        <option value="">No figure (fallback cover)</option>
        {Object.keys(pieces).map((n) => <option key={n} value={n}>{n}</option>)}
      </Select>
      {piece && <Card padding={3} radius={2} tone="transparent" border><Flex justify="center"><Preview name={piece} /></Flex></Card>}
      {piece && props.renderDefault({ ...props, members: props.members.filter((m) => m.kind !== 'field' || m.name !== 'piece') })}
    </Stack>
  );
}
