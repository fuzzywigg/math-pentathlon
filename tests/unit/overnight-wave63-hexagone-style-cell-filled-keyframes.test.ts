/**
 * Wave 63 leftover after #301 — Hex-a-Gone cell-filled + hexFillPlace residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hexagone — style cell-filled keyframes', () => {
  it('pins .hex-a-gone-cell-filled stroke #444 + hexFillPlace', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-cell-filled');
    expect(css).toContain('stroke: #444');
    expect(css).toContain('@keyframes hexFillPlace');
  });
});
