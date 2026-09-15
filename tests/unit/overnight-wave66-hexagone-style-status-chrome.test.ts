/**
 * Wave 66 leftover after tip/#316 — Hex-a-Gone status chrome exact.
 * Soft confirm/bank; lock status gradient/radius leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hexagone — style status chrome', () => {
  it('hex-a-gone-status border-radius 12 + white gradient exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-status {');
    expect(css).toMatch(
      /\.hex-a-gone-status\s*\{[^}]*border-radius:\s*12px/s
    );
    expect(css).toContain(
      'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
    );
  });
});
