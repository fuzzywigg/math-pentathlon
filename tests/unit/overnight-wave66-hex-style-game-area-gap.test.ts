/**
 * Wave 66 leftover after tip/#316 — Hex .hex-game-area gap exact.
 * Soft game-area layout; lock gap/padding leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hex — style game-area gap', () => {
  it('hex-game-area flex column + gap 16px + padding exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-game-area {');
    expect(css).toMatch(/\.hex-game-area\s*\{[^}]*flex-direction:\s*column/s);
    expect(css).toMatch(/\.hex-game-area\s*\{[^}]*gap:\s*16px/s);
    expect(css).toMatch(/\.hex-game-area\s*\{[^}]*padding:\s*16px/s);
  });
});
