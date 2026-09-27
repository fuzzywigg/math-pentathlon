/**
 * Wave 69 leftover after tip/#350 — Star Track chain-btn radius/border.
 * Soft chain-btn click wiring existed; lock style.css leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 69 star-track — style chain-btn radius', () => {
  it('chain-btn pins radius 14px, border #e2e8f0, min-width 100px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.star-track-chain-btn\s*\{[^}]*border-radius:\s*14px/s
    );
    expect(css).toMatch(
      /\.star-track-chain-btn\s*\{[^}]*border:\s*3px solid #e2e8f0/s
    );
    expect(css).toMatch(
      /\.star-track-chain-btn\s*\{[^}]*min-width:\s*100px/s
    );
  });
});
