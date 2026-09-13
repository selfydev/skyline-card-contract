import type { PropsDiff } from './diff-props';
import type { TokenDiff } from './diff-tokens';

export function report(props: PropsDiff, tokens: TokenDiff[], meta: { fileKey: string; setId: string; variablesEndpoint: boolean }): { markdown: string; drift: boolean } {
  const lines: string[] = ['# Parity report', '', `File ${meta.fileKey}, set ${meta.setId}.`, ''];
  const drift = props.onlyInFigma.length + props.onlyInCode.length + props.optionMismatch.length + tokens.length > 0;
  lines.push('## Properties');
  if (!props.onlyInFigma.length && !props.onlyInCode.length && !props.optionMismatch.length) lines.push('In sync.');
  for (const p of props.onlyInFigma) lines.push(`- In Figma, not in code: ${p}`);
  for (const p of props.onlyInCode) lines.push(`- In code, not in Figma: ${p}`);
  for (const m of props.optionMismatch) lines.push(`- Options differ on ${m.prop}. Figma: ${m.figma.join(', ')}. Code: ${m.code.join(', ')}.`);
  lines.push('', '## Tokens');
  if (!meta.variablesEndpoint) lines.push('Variable names were not available from the REST API on this plan, so bindings are compared by resolved colour against the committed token export.');
  if (!tokens.length) lines.push('In sync.');
  for (const t of tokens) lines.push(`- ${t.node} binds ${t.token}: Figma ${t.figma}, code ${t.code ?? 'missing'}`);
  return { markdown: lines.join('\n'), drift };
}
