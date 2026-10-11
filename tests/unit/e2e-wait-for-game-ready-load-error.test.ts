/**
 * Source contract: e2e waitForGameReady rejects game-load-error (q-mp-1294).
 * Behavior covered hermetically for scripts/lib/page-ready.mjs in page-ready.test.ts.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const PAGE_HELPER = resolve(__dirname, '../e2e/helpers/page.ts');

describe('e2e waitForGameReady load-error gate (q-mp-1294)', () => {
  const src = readFileSync(PAGE_HELPER, 'utf8');

  it('waits for game-load-error to be hidden before chrome', () => {
    expect(src).toMatch(
      /getByTestId\(\s*['"]game-load-error['"]\s*\)[\s\S]*?toBeHidden/
    );
    const loadErrorIdx = src.indexOf("getByTestId('game-load-error')");
    const chromeIdx = src.indexOf("'#new-game-btn, h1'");
    expect(loadErrorIdx).toBeGreaterThan(-1);
    expect(chromeIdx).toBeGreaterThan(loadErrorIdx);
  });

  it('still waits for game-loading hidden first', () => {
    const loadingIdx = src.indexOf("getByTestId('game-loading')");
    const loadErrorIdx = src.indexOf("getByTestId('game-load-error')");
    expect(loadingIdx).toBeGreaterThan(-1);
    expect(loadErrorIdx).toBeGreaterThan(loadingIdx);
  });
});
