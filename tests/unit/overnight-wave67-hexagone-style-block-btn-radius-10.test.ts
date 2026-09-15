/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone block-btn radius 10. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style block-btn radius 10', () => {
  it('hex-a-gone-block-btn border-radius 10px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-block-btn\s*\{[^}]*border-radius:\s*10px/s);
  });
});
