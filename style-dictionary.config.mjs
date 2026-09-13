export default {
  usesDtcg: true,
  source: ['tokens/*.tokens.json'],
  platforms: {
    css: {
      transforms: ['name/kebab', 'color/css'],
      buildPath: 'build/',
      files: [{ destination: 'tokens.css', format: 'css/variables', options: { outputReferences: true } }],
    },
  },
};
