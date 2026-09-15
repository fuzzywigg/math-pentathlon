/**
 * Wave 67 leftover after tip/#316 — Sum dice-area justify chrome.
 * Soft game-area gap existed; lock dice-area justify + pad leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style dice-area justify', () => {
  it('pins sd-dice-area justify center + padding 1rem leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-dice-area\s*\{[\s\S]*?justify-content:\s*center/
    );
    expect(css).toMatch(/\.sd-dice-area\s*\{[\s\S]*?padding:\s*1rem/);
  });
});
