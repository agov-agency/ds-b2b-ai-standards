// Figure picker: a tile per figure with its still frame, then a live preview of the picked one.
// Renders the same draw(t) the site plays (site/src/art), so editors see what they pick.
import { useEffect, useRef } from 'react';
import { Card, Grid, Stack, Text } from '@sanity/ui';
import { set, unset, type ObjectInputProps } from 'sanity';
import { pieces } from '../../site/src/art';

const CSS = `.f{stroke:#0a0a0a;stroke-width:1.5}.paper{fill:#fff}.tint{fill:#dde8ff}.body{fill:#b8ceff}.blk,.head{fill:#0a0a0a}
.det{fill:none;stroke:#0a0a0a;stroke-width:1}.hl{fill:none;stroke:#3b6cff;stroke-width:1.5}.dashed{stroke-dasharray:4 3}.nofill{fill:none}
.dash{fill:none;stroke:#0a0a0a;stroke-width:2;stroke-dasharray:8 6}.lit .body{fill:#3b6cff}.type{fill:#fff;font:600 10px monospace}
*{vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}`;
const still = (name: string) => pieces[name].draw(pieces[name].rest);

function Live({ name }: { name: string }) {
  const g = useRef<SVGGElement>(null);
  const piece = pieces[name];
  useEffect(() => {
    if (!piece || !g.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0; const t0 = performance.now();
    const tick = (now: number) => { g.current!.innerHTML = piece.draw(piece.rest + (now - t0) / 1000 * 0.6); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [piece]);
  if (!piece) return <Text muted size={1}>No figure called “{name}” in site/src/art: pick another</Text>;
  return <svg viewBox={piece.viewBox} style={{ width: '100%', maxHeight: 320 }}><style>{CSS}</style><g ref={g} dangerouslySetInnerHTML={{ __html: still(name) }} /></svg>;
}

function Tile({ name, on, pick }: { name?: string; on: boolean; pick: () => void }) {
  return (
    <Card as="button" type="button" onClick={pick} padding={2} radius={2} border tone={on ? 'primary' : 'default'} style={{ cursor: 'pointer', outline: on ? '2px solid var(--card-focus-ring-color)' : undefined }}>
      <Stack space={2}>
        <div style={{ aspectRatio: '4 / 3', display: 'grid', placeItems: 'center' }}>
          {name
            ? <svg viewBox={pieces[name].viewBox} style={{ width: '100%', height: '100%' }}><style>{CSS}</style><g dangerouslySetInnerHTML={{ __html: still(name) }} /></svg>
            : <Text muted size={1}>None</Text>}
        </div>
        <Text size={1} align="center">{name ?? 'Default cover'}</Text>
      </Stack>
    </Card>
  );
}

export function ArtInput(props: ObjectInputProps) {
  const piece = (props.value as { piece?: string } | undefined)?.piece;
  return (
    <Stack space={3}>
      <Grid columns={[2, 3, 4]} gap={2}>
        <Tile on={!piece} pick={() => props.onChange(unset())} />
        {Object.keys(pieces).map((n) => <Tile key={n} name={n} on={piece === n} pick={() => props.onChange(set(n, ['piece']))} />)}
      </Grid>
      {piece && <Card padding={3} radius={2} border><Live name={piece} /></Card>}
      {piece && props.renderDefault({ ...props, members: props.members.filter((m) => m.kind !== 'field' || m.name !== 'piece') })}
    </Stack>
  );
}
