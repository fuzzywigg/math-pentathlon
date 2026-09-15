/**
 * Wave 67 leftover after tip/#324 — Sum dice-area justify center chrome.
 * Soft pad 1rem existed; lock justify-content center leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 sum — style dice-area justify', () => {
  it('pins sd-dice-area justify-content center leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-dice-area\s*\{[\s\S]*?justify-content:\s*center/
    );
  });
});
