import { normalise } from './normalise';

export interface FigmaPropDef { type: 'VARIANT' | 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP'; variantOptions?: string[] }
export type CodeProps = Record<string, readonly string[] | 'boolean' | 'text' | 'slot'>;
export interface PropsDiff { onlyInFigma: string[]; onlyInCode: string[]; optionMismatch: { prop: string; figma: string[]; code: string[] }[] }

export function diffProps(figma: Record<string, FigmaPropDef>, code: CodeProps): PropsDiff {
  const figmaKeys = new Map(Object.keys(figma).map((k) => [normalise(k), k]));
  const codeKeys = new Map(Object.keys(code).map((k) => [normalise(k), k]));
  const onlyInFigma = [...figmaKeys].filter(([n]) => !codeKeys.has(n)).map(([, k]) => k.split('#')[0]);
  const onlyInCode = [...codeKeys].filter(([n]) => !figmaKeys.has(n)).map(([, k]) => k);
  const optionMismatch: PropsDiff['optionMismatch'] = [];
  for (const [n, fk] of figmaKeys) {
    const ck = codeKeys.get(n); if (!ck) continue;
    const def = figma[fk]; const codeDef = code[ck];
    if (def.type !== 'VARIANT' || !Array.isArray(codeDef)) continue;
    const f = (def.variantOptions ?? []).map((o) => o.toLowerCase()); const c = codeDef.map((o) => o.toLowerCase());
    if (f.join('|') !== c.join('|')) optionMismatch.push({ prop: ck, figma: f, code: c });
  }
  return { onlyInFigma, onlyInCode, optionMismatch };
}
