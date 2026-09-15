/**
 * Wave 66 leftover after tip/#316 — Sum game-area gap chrome leftover.
 * Soft main-layout media existed; lock game-area column gap/pad. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 sum — style game-area gap', () => {
  it('pins sd-game-area column center gap/pad 1rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.sd-game-area\s*\{[\s\S]*?flex-direction:\s*column/
    );
    expect(css).toMatch(/\.sd-game-area\s*\{[\s\S]*?gap:\s*1rem/);
    expect(css).toMatch(/\.sd-game-area\s*\{[\s\S]*?padding:\s*1rem/);
  });
});
