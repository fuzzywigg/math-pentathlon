/**
 * Wave 63 leftover after #301 — Hex .hex-game-area layout chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hex — style game-area layout', () => {
  it('pins .hex-game-area flex column gap/pad leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-game-area');
    expect(css).toMatch(/\.hex-game-area\s*\{[^}]*flex-direction:\s*column/s);
    expect(css).toMatch(/\.hex-game-area\s*\{[^}]*gap:\s*16px/s);
    expect(css).toMatch(/\.hex-game-area\s*\{[^}]*padding:\s*16px/s);
  });
});
