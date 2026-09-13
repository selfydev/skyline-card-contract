// Runs inside Figma through the Desktop Bridge. Returns { colors, spacing, textStyles } as DTCG JSON trees.
// Variable names are used exactly as they are in Figma. Aliases become {a.b.c} references.
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(vars.map((v) => [v.id, v]));
const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('') + (c.a !== undefined && c.a < 1 ? Math.round(c.a * 255).toString(16).padStart(2, '0') : '');
const setPath = (obj, path, leaf) => { const parts = path.split('/'); let cur = obj; for (const p of parts.slice(0, -1)) cur = cur[p] = cur[p] || {}; cur[parts[parts.length - 1]] = leaf; };
const out = {};
for (const col of cols) {
  const mode = col.modes[0].modeId; const tree = {};
  for (const id of col.variableIds) {
    const v = byId[id]; const raw = v.valuesByMode[mode];
    const isAlias = raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS';
    const type = v.resolvedType === 'COLOR' ? 'color' : v.name.startsWith('radius/') || v.name.startsWith('spacing/') ? 'dimension' : 'number';
    const value = isAlias ? '{' + byId[raw.id].name.replace(/\//g, '.') + '}' : v.resolvedType === 'COLOR' ? hex(raw) : type === 'dimension' ? raw + 'px' : raw;
    setPath(tree, v.name, { $type: type, $value: value });
  }
  out[col.name.toLowerCase()] = tree;
}
const weight = { Thin: 100, 'Extra Light': 200, Light: 300, Regular: 400, Medium: 500, 'Semi Bold': 600, Bold: 700, 'Extra Bold': 800, Black: 900 };
const styles = await figma.getLocalTextStylesAsync();
const ts = {};
for (const s of styles) {
  const ls = s.letterSpacing.unit === 'PIXELS' ? s.letterSpacing.value + 'px' : s.letterSpacing.value + '%';
  const lh = s.lineHeight.unit === 'PIXELS' ? s.lineHeight.value + 'px' : s.lineHeight.unit === 'PERCENT' ? s.lineHeight.value + '%' : 'normal';
  setPath(ts, s.name, {
    $type: 'typography',
    $value: { fontFamily: s.fontName.family, fontWeight: weight[s.fontName.style] || 400, fontSize: s.fontSize + 'px', lineHeight: lh, letterSpacing: ls },
  });
}
out.textStyles = ts;
return JSON.stringify(out);
