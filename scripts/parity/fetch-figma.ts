import type { FigmaPropDef } from './diff-props';
import type { BoundFill } from './diff-tokens';

const API = 'https://api.figma.com/v1';
const headers = (token: string) => ({ 'X-Figma-Token': token });

export async function fetchCardSet(fileKey: string, setId: string, token: string) {
  const res = await fetch(`${API}/files/${fileKey}/nodes?ids=${encodeURIComponent(setId)}`, { headers: headers(token) });
  if (!res.ok) throw new Error(`Figma nodes request failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { nodes: Record<string, { document: any }> };
  const doc = Object.values(json.nodes)[0]?.document;
  if (!doc) throw new Error(`node ${setId} not found in file ${fileKey}`);
  return doc;
}

export function propsFromSet(doc: any): Record<string, FigmaPropDef> {
  return doc.componentPropertyDefinitions ?? {};
}

export async function variableNames(fileKey: string, token: string): Promise<Record<string, string> | null> {
  const res = await fetch(`${API}/files/${fileKey}/variables/local`, { headers: headers(token) });
  if (res.status === 403 || res.status === 404) return null; // needs Enterprise, fall back to hex only
  if (!res.ok) throw new Error(`Figma variables request failed: ${res.status}`);
  const json = (await res.json()) as { meta: { variables: Record<string, { name: string }> } };
  return Object.fromEntries(Object.entries(json.meta.variables).map(([id, v]) => [id, v.name]));
}

const hex = (c: { r: number; g: number; b: number }) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');

export function boundFillsFromSet(doc: any, names: Record<string, string> | null): BoundFill[] {
  const out: BoundFill[] = [];
  const visit = (n: any) => {
    for (const kind of ['fills', 'strokes'] as const) {
      const paint = n[kind]?.[0];
      const id = n.boundVariables?.[kind]?.[0]?.id;
      if (paint?.type === 'SOLID' && id) out.push({ node: n.name, token: names?.[id] ?? id, hex: hex(paint.color) });
    }
    (n.children ?? []).forEach(visit);
  };
  (doc.children ?? []).slice(0, 1).forEach(visit); // one variant is enough, they share bindings
  return out;
}
