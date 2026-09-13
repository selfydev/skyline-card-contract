import { diffTokens, diffTokensByValue, flattenDtcg } from '../diff-tokens';

const primitives = { colour: { blue: { '700': { $type: 'color', $value: '#0b3fa6' } }, white: { $type: 'color', $value: '#ffffff' } } };
const semantic = { card: { surface: { $type: 'color', $value: '{colour.white}' }, border: { selected: { $type: 'color', $value: '{colour.blue.700}' } } } };

describe('flattenDtcg', () => {
  it('flattens to slash paths and resolves aliases', () => {
    expect(flattenDtcg(primitives, semantic)).toEqual({ 'colour/blue/700': '#0b3fa6', 'colour/white': '#ffffff', 'card/surface': '#ffffff', 'card/border/selected': '#0b3fa6' });
  });
});

describe('diffTokens', () => {
  const tokens = flattenDtcg(primitives, semantic);
  it('reports nothing when a bound fill resolves to the token value', () => {
    expect(diffTokens([{ node: 'Body', token: 'card/surface', hex: '#ffffff' }], tokens)).toEqual([]);
  });
  it('reports a value mismatch', () => {
    expect(diffTokens([{ node: 'Root', token: 'card/border/selected', hex: '#0a3ca0' }], tokens)).toEqual([{ node: 'Root', token: 'card/border/selected', figma: '#0a3ca0', code: '#0b3fa6' }]);
  });
  it('reports a token bound in figma that code does not have', () => {
    expect(diffTokens([{ node: 'Root', token: 'card/glow', hex: '#ff00ff' }], tokens)).toEqual([{ node: 'Root', token: 'card/glow', figma: '#ff00ff', code: null }]);
  });
});

describe('diffTokensByValue', () => {
  const tokens = flattenDtcg(primitives, semantic);
  it('reports nothing when the hex exists in the export', () => {
    expect(diffTokensByValue([{ node: 'Body', token: 'VariableID:1:1', hex: '#ffffff' }], tokens)).toEqual([]);
  });
  it('reports a row when the hex does not exist in the export', () => {
    expect(diffTokensByValue([{ node: 'Root', token: 'VariableID:9:9', hex: '#ff00ff' }], tokens)).toEqual([{ node: 'Root', token: 'VariableID:9:9', figma: '#ff00ff', code: null }]);
  });
});
