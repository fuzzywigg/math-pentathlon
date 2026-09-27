/**
 * Wave 69 leftover after tip/#350 — Star Track chain-area radius/gradient.
 * Soft choices mount existed; lock style.css leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 69 star-track — style chain-area chrome', () => {
  it('chain-area pins radius 16px and #f7fafc gradient', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.star-track-chain-area\s*\{[^}]*border-radius:\s*16px/s
    );
    expect(css).toMatch(
      /\.star-track-chain-area\s*\{[^}]*linear-gradient\(135deg,\s*#f7fafc 0%,\s*#edf2f7 100%\)/s
    );
    expect(css).toMatch(
      /\.star-track-chain-area\s*\{[^}]*min-width:\s*280px/s
    );
  });
});
