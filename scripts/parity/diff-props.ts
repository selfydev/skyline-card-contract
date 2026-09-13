import { normalise } from './normalise';

export interface FigmaPropDef { type: 'VARIANT' | 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP'; variantOptions?: string[] }
export type CodeProps = Record<string, readonly string[] | 'boolean' | 'text' | 'slot'>;
export interface PropsDiff {
  onlyInFigma: string[];
  onlyInCode: string[];
  optionMismatch: { prop: string; figma: string[]; code: string[] }[];
  typeMismatch: { prop: string; figma: FigmaPropDef['type']; code: string }[];
}

const EXPECTED_CODE_TYPE: Record<FigmaPropDef['type'], string> = {
  VARIANT: 'array',
  BOOLEAN: 'boolean',
  TEXT: 'text',
  INSTANCE_SWAP: 'slot',
};

const codeTypeOf = (v: CodeProps[string]): string => (Array.isArray(v) ? 'array' : (v as string));

export function diffProps(figma: Record<string, FigmaPropDef>, code: CodeProps): PropsDiff {
  const figmaKeys = new Map(Object.keys(figma).map((k) => [normalise(k), k]));
  const codeKeys = new Map(Object.keys(code).map((k) => [normalise(k), k]));
  const onlyInFigma = [...figmaKeys].filter(([n]) => !codeKeys.has(n)).map(([, k]) => k.split('#')[0]);
  const onlyInCode = [...codeKeys].filter(([n]) => !figmaKeys.has(n)).map(([, k]) => k);
  const optionMismatch: PropsDiff['optionMismatch'] = [];
  const typeMismatch: PropsDiff['typeMismatch'] = [];
  for (const [n, fk] of figmaKeys) {
    const ck = codeKeys.get(n); if (!ck) continue;
    const def = figma[fk]; const codeDef = code[ck];
    const expected = EXPECTED_CODE_TYPE[def.type];
    const actual = codeTypeOf(codeDef);
    if (actual !== expected) { typeMismatch.push({ prop: ck, figma: def.type, code: actual }); continue; }
    if (def.type !== 'VARIANT' || !Array.isArray(codeDef)) continue;
    const f = (def.variantOptions ?? []).map((o) => o.toLowerCase());
    const c = codeDef.map((o) => o.toLowerCase());
    if ([...f].sort().join('|') !== [...c].sort().join('|')) optionMismatch.push({ prop: ck, figma: f, code: c });
  }
  return { onlyInFigma, onlyInCode, optionMismatch, typeMismatch };
}
