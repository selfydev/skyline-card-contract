import { boundFillsFromSet, propsFromSet } from '../fetch-figma';

describe('propsFromSet', () => {
  it('throws on an unknown property definition type', () => {
    const doc = { name: 'Add-on card', componentPropertyDefinitions: { Ribbon: { type: 'WEIRD' } } };
    expect(() => propsFromSet(doc as never)).toThrow('Ribbon');
  });
});

describe('boundFillsFromSet', () => {
  it('skips a paint with no color', () => {
    const doc = {
      name: 'Add-on card',
      children: [
        {
          name: 'Default, LTR',
          fills: [{ type: 'SOLID' }],
          boundVariables: { fills: [{ id: 'VariableID:1:1' }] },
        },
      ],
    };
    expect(boundFillsFromSet(doc as never, null)).toEqual([]);
  });

  it('emits a correct hex for a valid bound fill', () => {
    const doc = {
      name: 'Add-on card',
      children: [
        {
          name: 'Body',
          fills: [{ type: 'SOLID', color: { r: 0, g: 0.278, b: 0.671 } }],
          boundVariables: { fills: [{ id: 'VariableID:1:1' }] },
        },
      ],
    };
    expect(boundFillsFromSet(doc as never, null)).toEqual([{ node: 'Body', token: 'VariableID:1:1', hex: '#0047ab' }]);
  });

  it('reads the bound variable id from the node level boundVariables, not the paint', () => {
    const doc = {
      name: 'Add-on card',
      children: [
        {
          name: 'Root',
          strokes: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
          boundVariables: { strokes: [{ id: 'VariableID:2:2' }] },
        },
      ],
    };
    expect(boundFillsFromSet(doc as never, { 'VariableID:2:2': 'card/border/selected' })).toEqual([{ node: 'Root', token: 'card/border/selected', hex: '#ffffff' }]);
  });
});
