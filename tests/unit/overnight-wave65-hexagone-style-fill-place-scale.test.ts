/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone hexFillPlace scale 1.08. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style fill-place scale', () => {
  it('hexFillPlace scale(1.08)', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('@keyframes hexFillPlace');
    expect(css).toContain('scale(1.08)');
  });
});
