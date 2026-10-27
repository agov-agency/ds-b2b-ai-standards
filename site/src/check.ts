// Build check (brief): every category, author, skill and rule a content file names must exist, or the build fails.
import { getCollection, getEntry } from 'astro:content';

async function run() {
  const bad: string[] = [];
  const need = async (from: string, ref?: { collection: string; id: string }) => {
    if (ref && !(await getEntry(ref as any))) bad.push(`${from} → ${ref.collection}/${ref.id}`);
  };
  for (const s of await getCollection('scenarios')) {
    await need(`scenarios/${s.id}`, s.data.author);
    await need(`scenarios/${s.id}`, s.data.category);
    for (const r of [...s.data.skills, ...s.data.rules]) await need(`scenarios/${s.id}`, r);
  }
  for (const s of await getCollection('skills')) {
    await need(`skills/${s.id}`, s.data.author);
    await need(`skills/${s.id}`, s.data.area);
    for (const r of s.data.rules) await need(`skills/${s.id}`, r);
  }
  for (const r of await getCollection('rules')) await need(`rules/${r.id}`, r.data.area);
  if (bad.length) throw new Error(`Broken content links:\n${bad.join('\n')}`);
}
export const checked = run();
