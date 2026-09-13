import { parseEnvFile } from '../load-env';

describe('parseEnvFile', () => {
  it('parses KEY=VALUE lines', () => {
    expect(parseEnvFile('FIGMA_FILE_KEY=abc123\nFIGMA_CARD_SET_ID=70:400')).toEqual({
      FIGMA_FILE_KEY: 'abc123',
      FIGMA_CARD_SET_ID: '70:400',
    });
  });

  it('ignores blank lines and comments', () => {
    expect(parseEnvFile('# a comment\n\nFOO=bar\n')).toEqual({ FOO: 'bar' });
  });

  it('strips surrounding double or single quotes', () => {
    expect(parseEnvFile('A="one"\nB=\'two\'')).toEqual({ A: 'one', B: 'two' });
  });

  it('trims whitespace around key and value', () => {
    expect(parseEnvFile('  FOO = bar  ')).toEqual({ FOO: 'bar' });
  });
});
