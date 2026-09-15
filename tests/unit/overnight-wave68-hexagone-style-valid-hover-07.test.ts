/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone valid hover fill 0.7. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style valid hover 0.7', () => {
  it('valid:hover fill 0.7 + scale 1.05 + filter 10px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('fill: rgba(144, 238, 144, 0.7)');
    expect(css).toMatch(/\.hex-a-gone-cell-valid:hover\s*\{[^}]*transform:\s*scale\(1\.05\)/s);
    expect(css).toContain('drop-shadow(0 0 10px rgba(76, 175, 80, 0.7))');
  });
});
