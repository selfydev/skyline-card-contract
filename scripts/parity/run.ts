import { readFileSync, writeFileSync } from 'node:fs';
import { ADD_ON_CARD_PROPS } from '../../src/components/AddOnCard/AddOnCard.props';
import { diffProps } from './diff-props';
import { diffTokens, diffTokensByValue, flattenDtcg } from './diff-tokens';
import { boundFillsFromSet, fetchCardSet, propsFromSet, variableNames } from './fetch-figma';
import { loadEnvFile } from './load-env';
import { report } from './report';

loadEnvFile();

const need = (k: string) => { const v = process.env[k]; if (!v) { console.error(`missing env ${k}`); process.exit(2); } return v; };

const fileKey = need('FIGMA_FILE_KEY'); const setId = need('FIGMA_CARD_SET_ID'); const token = need('FIGMA_ACCESS_TOKEN');
const doc = await fetchCardSet(fileKey, setId, token);
const names = await variableNames(fileKey, token);
const tokens = flattenDtcg(JSON.parse(readFileSync('tokens/colors.tokens.json', 'utf8')), JSON.parse(readFileSync('tokens/spacing.tokens.json', 'utf8')));
const fills = boundFillsFromSet(doc, names);
const tokenDiff = names ? diffTokens(fills, tokens) : diffTokensByValue(fills, tokens);
const { markdown, drift } = report(diffProps(propsFromSet(doc), ADD_ON_CARD_PROPS), tokenDiff, { fileKey, setId, variablesEndpoint: names !== null, boundColourCount: fills.length });
writeFileSync('parity-report.md', markdown);
console.log(markdown);
process.exit(drift ? 1 : 0);
