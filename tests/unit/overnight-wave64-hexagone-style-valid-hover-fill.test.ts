/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone valid cell hover fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 hexagone — style valid hover fill', () => {
  it('cell-valid:hover fill 0.7 + scale 1.05', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-cell-valid:hover');
    expect(css).toContain('rgba(144, 238, 144, 0.7)');
    expect(css).toMatch(/\.hex-a-gone-cell-valid:hover\s*\{[^}]*transform:\s*scale\(1\.05\)/s);
  });
});
