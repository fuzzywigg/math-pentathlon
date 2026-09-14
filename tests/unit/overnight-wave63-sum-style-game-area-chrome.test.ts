/**
 * Wave 63 Contig/SD residual after tip #301 — Sum style.css game-area chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 sum — style game-area chrome', () => {
  it('pins .sd-game-area flex/align/gap/pad leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-game-area\s*\{[\s\S]*?flex-direction:\s*column/);
    expect(css).toMatch(/\.sd-game-area\s*\{[\s\S]*?align-items:\s*center/);
    expect(css).toMatch(/\.sd-game-area\s*\{[\s\S]*?gap:\s*1rem/);
    expect(css).toMatch(/\.sd-game-area\s*\{[\s\S]*?padding:\s*1rem/);
  });
});
