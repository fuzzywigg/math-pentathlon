/**
 * Wave 63 leftover after #301 — Hex-a-Gone empty cell hover fill residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hexagone — style cell hover fill', () => {
  it('pins .hex-a-gone-cell:hover fill #e0e0e0 leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-cell:hover');
    expect(css).toContain('fill: #e0e0e0');
    expect(css).toContain('transform: scale(1.02)');
  });
});
