import { diffProps, type FigmaPropDef } from '../diff-props';
import { ADD_ON_CARD_PROPS } from '../../../src/components/AddOnCard/AddOnCard.props';

const figma: Record<string, FigmaPropDef> = {
  'State': { type: 'VARIANT', variantOptions: ['Default', 'Selected', 'Disabled'] },
  'Direction': { type: 'VARIANT', variantOptions: ['LTR', 'RTL'] },
  'Discount#1:0': { type: 'BOOLEAN' },
  'Show description#1:1': { type: 'BOOLEAN' },
  'Media#1:2': { type: 'INSTANCE_SWAP' },
  'Title#1:3': { type: 'TEXT' }, 'Description#1:4': { type: 'TEXT' }, 'Price#1:5': { type: 'TEXT' },
  'Original price#1:6': { type: 'TEXT' }, 'Badge label#1:7': { type: 'TEXT' }, 'CTA label#1:8': { type: 'TEXT' },
  'Selected label#1:9': { type: 'TEXT' },
};

describe('diffProps', () => {
  it('reports nothing when figma and code agree', () => {
    expect(diffProps(figma, ADD_ON_CARD_PROPS)).toEqual({ onlyInFigma: [], onlyInCode: [], optionMismatch: [], typeMismatch: [] });
  });
  it('reports a property only in figma', () => {
    const d = diffProps({ ...figma, 'Ribbon#9:9': { type: 'BOOLEAN' } }, ADD_ON_CARD_PROPS);
    expect(d.onlyInFigma).toEqual(['Ribbon']);
  });
  it('reports a property only in code', () => {
    const d = diffProps(figma, { ...ADD_ON_CARD_PROPS, compact: 'boolean' });
    expect(d.onlyInCode).toEqual(['compact']);
  });
  it('reports variant options that differ', () => {
    const d = diffProps({ ...figma, State: { type: 'VARIANT', variantOptions: ['Default', 'Selected', 'Disabled', 'Loading'] } }, ADD_ON_CARD_PROPS);
    expect(d.optionMismatch).toEqual([{ prop: 'state', figma: ['default', 'selected', 'disabled', 'loading'], code: ['default', 'selected', 'disabled'] }]);
  });
  it('does not report drift when variant options are only reordered', () => {
    const d = diffProps({ ...figma, State: { type: 'VARIANT', variantOptions: ['Selected', 'Default', 'Disabled'] } }, ADD_ON_CARD_PROPS);
    expect(d.optionMismatch).toEqual([]);
  });
  it('reports a type mismatch when a boolean becomes a variant', () => {
    const d = diffProps({ ...figma, 'Discount': { type: 'VARIANT', variantOptions: ['On', 'Off'] } }, ADD_ON_CARD_PROPS);
    expect(d.typeMismatch).toEqual([{ prop: 'discount', figma: 'VARIANT', code: 'boolean' }]);
  });
});
