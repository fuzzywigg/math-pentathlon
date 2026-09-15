/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone cell-valid fill 0.4. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style valid fill 0.4', () => {
  it('cell-valid rgba 0.4 base fill', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-cell-valid\s*\{[^}]*rgba\(144, 238, 144, 0\.4\)/s);
  });
});
