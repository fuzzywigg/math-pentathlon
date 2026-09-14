/**
 * Wave 63 leftover after #301 — Hex-a-Gone block-btn border #e2e8f0 residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hexagone — style block-btn border', () => {
  it('pins block-btn border #e2e8f0 + f7fafc gradient leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-block-btn');
    expect(css).toContain('border: 2px solid #e2e8f0');
    expect(css).toContain('#f7fafc');
  });
});
