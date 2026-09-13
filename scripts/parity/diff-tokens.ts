type Tree = Record<string, unknown>;
export interface BoundFill { node: string; token: string; hex: string }
export interface TokenDiff { node: string; token: string; figma: string; code: string | null }

const walk = (tree: Tree, prefix: string[], out: Record<string, string>) => {
  for (const [k, v] of Object.entries(tree)) {
    if (v && typeof v === 'object' && '$value' in (v as Tree)) out[[...prefix, k].join('/')] = String((v as Tree).$value);
    else if (v && typeof v === 'object') walk(v as Tree, [...prefix, k], out);
  }
};

export function flattenDtcg(...trees: Tree[]): Record<string, string> {
  const raw: Record<string, string> = {};
  for (const t of trees) walk(t, [], raw);
  const resolve = (v: string, depth = 0): string => {
    const m = v.match(/^\{(.+)\}$/); if (!m || depth > 10) return v;
    const target = raw[m[1].replace(/\./g, '/')]; if (target === undefined) throw new Error(`unresolved alias ${v}`);
    return resolve(target, depth + 1);
  };
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, resolve(v)]));
}

export function diffTokens(fills: BoundFill[], tokens: Record<string, string>): TokenDiff[] {
  const out: TokenDiff[] = [];
  for (const f of fills) {
    const code = tokens[f.token] ?? null;
    if (code === null || code.toLowerCase() !== f.hex.toLowerCase()) out.push({ node: f.node, token: f.token, figma: f.hex, code });
  }
  return out;
}

export function diffTokensByValue(fills: BoundFill[], tokens: Record<string, string>): TokenDiff[] {
  const values = new Set(Object.values(tokens).map((v) => v.toLowerCase()));
  const out: TokenDiff[] = [];
  for (const f of fills) {
    if (!values.has(f.hex.toLowerCase())) out.push({ node: f.node, token: f.token, figma: f.hex, code: null });
  }
  return out;
}
