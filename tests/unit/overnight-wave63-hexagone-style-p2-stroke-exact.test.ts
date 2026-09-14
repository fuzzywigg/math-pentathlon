/**
 * Wave 63 leftover after #301 — Hex-a-Gone cell-p2 stroke #c62828 residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hexagone — style p2 stroke', () => {
  it('pins .hex-a-gone-cell-p2 stroke #c62828 leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-cell-p2');
    expect(css).toContain('stroke: #c62828');
  });
});
