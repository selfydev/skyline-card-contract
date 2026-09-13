import type { FigmaPropDef } from './diff-props';
import type { BoundFill } from './diff-tokens';

const API = 'https://api.figma.com/v1';
const headers = (token: string) => ({ 'X-Figma-Token': token });

const PROP_TYPES = new Set(['VARIANT', 'BOOLEAN', 'TEXT', 'INSTANCE_SWAP']);

export interface FigmaPaint { type: string; color?: { r: number; g: number; b: number } }
export interface FigmaNode {
  name: string;
  children?: FigmaNode[];
  fills?: FigmaPaint[];
  strokes?: FigmaPaint[];
  boundVariables?: Record<string, { id: string }[]>;
  componentPropertyDefinitions?: Record<string, FigmaPropDef>;
}

export async function fetchCardSet(fileKey: string, setId: string, token: string): Promise<FigmaNode> {
  const res = await fetch(`${API}/files/${fileKey}/nodes?ids=${encodeURIComponent(setId)}`, { headers: headers(token) });
  if (!res.ok) throw new Error(`Figma nodes request failed: ${res.status} ${await res.text()}`);
  const json: unknown = await res.json();
  if (typeof json !== 'object' || json === null || !('nodes' in json)) {
    throw new Error(`Figma nodes response has an unexpected shape for ${setId}`);
  }
  const nodes = (json as { nodes: Record<string, { document?: unknown }> }).nodes;
  const doc = Object.values(nodes)[0]?.document;
  if (!doc || typeof doc !== 'object' || typeof (doc as { name?: unknown }).name !== 'string') {
    throw new Error(`Figma nodes response has an unexpected shape for ${setId}`);
  }
  return doc as FigmaNode;
}

export function propsFromSet(doc: FigmaNode): Record<string, FigmaPropDef> {
  const defs = doc.componentPropertyDefinitions ?? {};
  for (const [key, def] of Object.entries(defs)) {
    if (typeof def.type !== 'string' || !PROP_TYPES.has(def.type)) {
      throw new Error(`unexpected figma property definition type for ${key}`);
    }
  }
  return defs;
}

export async function variableNames(fileKey: string, token: string): Promise<Record<string, string> | null> {
  const res = await fetch(`${API}/files/${fileKey}/variables/local`, { headers: headers(token) });
  if (res.status === 403 || res.status === 404) return null; // needs Enterprise, fall back to hex only
  if (!res.ok) throw new Error(`Figma variables request failed: ${res.status}`);
  const json: unknown = await res.json();
  if (typeof json !== 'object' || json === null || !('meta' in json)) {
    throw new Error('Figma variables response has an unexpected shape');
  }
  const meta = (json as { meta: unknown }).meta;
  if (typeof meta !== 'object' || meta === null || typeof (meta as { variables?: unknown }).variables !== 'object' || (meta as { variables?: unknown }).variables === null) {
    throw new Error('Figma variables response has an unexpected shape');
  }
  const variables = (meta as { variables: Record<string, { name: string }> }).variables;
  return Object.fromEntries(Object.entries(variables).map(([id, v]) => [id, v.name]));
}

const isFiniteNumber = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

const hex = (c: { r: number; g: number; b: number }) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');

export function boundFillsFromSet(doc: FigmaNode, names: Record<string, string> | null): BoundFill[] {
  const out: BoundFill[] = [];
  const visit = (n: FigmaNode) => {
    for (const kind of ['fills', 'strokes'] as const) {
      const paint = n[kind]?.[0];
      const id = n.boundVariables?.[kind]?.[0]?.id;
      const color = paint?.color;
      const hasValidColor = typeof color === 'object' && color !== null && isFiniteNumber(color.r) && isFiniteNumber(color.g) && isFiniteNumber(color.b);
      if (paint?.type === 'SOLID' && hasValidColor && typeof id === 'string') {
        out.push({ node: n.name, token: names?.[id] ?? id, hex: hex(color) });
      }
    }
    (n.children ?? []).forEach(visit);
  };
  (doc.children ?? []).slice(0, 1).forEach(visit); // one variant is enough, they share bindings
  return out;
}
