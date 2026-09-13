import StyleDictionary from 'style-dictionary';

// Flatten typography composites into one custom property per field, e.g. --text-styles-heading-h4-font-size.
StyleDictionary.registerFormat({
  name: 'css/variables-with-typography',
  format: ({ dictionary }) => {
    const lines = dictionary.allTokens.flatMap((t) => {
      const v = t.$value ?? t.value;
      if (t.$type === 'typography' && v && typeof v === 'object') {
        return Object.entries(v).map(([k, val]) => `  --${t.name}-${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}: ${val};`);
      }
      return [`  --${t.name}: ${v};`];
    });
    return `:root {\n${lines.join('\n')}\n}\n`;
  },
});

export default {
  usesDtcg: true,
  source: ['tokens/*.tokens.json'],
  platforms: {
    css: {
      transforms: ['name/kebab', 'color/css'],
      buildPath: 'build/',
      files: [{ destination: 'tokens.css', format: 'css/variables-with-typography', options: { outputReferences: true } }],
    },
  },
};
