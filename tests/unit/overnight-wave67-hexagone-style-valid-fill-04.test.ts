/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone valid fill 0.4. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style valid fill 0.4', () => {
  it('hex-a-gone-cell-valid fill rgba 0.4 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('fill: rgba(144, 238, 144, 0.4)');
    expect(css).toContain('.hex-a-gone-cell-valid');
  });
});
