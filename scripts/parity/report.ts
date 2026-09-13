import type { PropsDiff } from './diff-props';
import type { TokenDiff } from './diff-tokens';

export function report(props: PropsDiff, tokens: TokenDiff[], meta: { fileKey: string; setId: string; variablesEndpoint: boolean; boundColourCount: number }): { markdown: string; drift: boolean } {
  const lines: string[] = ['# Parity report', '', `File ${meta.fileKey}, set ${meta.setId}.`, ''];
  const drift = props.onlyInFigma.length + props.onlyInCode.length + props.optionMismatch.length + props.typeMismatch.length + tokens.length > 0;
  lines.push('## Properties');
  if (!props.onlyInFigma.length && !props.onlyInCode.length && !props.optionMismatch.length && !props.typeMismatch.length) lines.push('In sync.');
  for (const p of props.onlyInFigma) lines.push(`- In Figma, not in code: ${p}`);
  for (const p of props.onlyInCode) lines.push(`- In code, not in Figma: ${p}`);
  for (const m of props.optionMismatch) lines.push(`- Options differ on ${m.prop}. Figma: ${m.figma.join(', ')}. Code: ${m.code.join(', ')}.`);
  for (const m of props.typeMismatch) lines.push(`- Type differs on ${m.prop}. Figma: ${m.figma}, code: ${m.code}.`);
  lines.push('', '## Tokens');
  if (!meta.variablesEndpoint) lines.push('Variable names are not available from the REST API on this plan, so every bound colour in the set is checked against the values in the committed export. A renamed token cannot be detected this way; a changed value can.');
  lines.push(`${meta.boundColourCount} bound colours checked.`);
  if (!tokens.length) lines.push('In sync.');
  for (const t of tokens) lines.push(`- ${t.node} binds ${t.token}: Figma ${t.figma}, code ${t.code ?? 'missing'}`);
  return { markdown: lines.join('\n'), drift };
}
