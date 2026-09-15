/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone cell hover scale 1.02. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style cell hover scale', () => {
  it('hex-a-gone-cell:hover fill e0e0e0 + scale 1.02', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-cell:hover\s*\{[^}]*fill:\s*#e0e0e0/s);
    expect(css).toMatch(/\.hex-a-gone-cell:hover\s*\{[^}]*transform:\s*scale\(1\.02\)/s);
  });
});
