/**
 * Wave 68 leftover after tip/#337 — Sum game-area display flex.
 * Soft column/gap existed; lock display flex leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 sum — style game-area display flex', () => {
  it('pins leftover chrome', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.sd-game-area\s*\{[\s\S]*?display:\s*flex/);
  });
});
