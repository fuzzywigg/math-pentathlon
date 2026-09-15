/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone p1/p2 seat filters. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style p1 p2 filters', () => {
  it('p1 stroke 1565c0 + p2 stroke c62828 filters', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-cell-p1\s*\{[^}]*stroke:\s*#1565c0/s);
    expect(css).toMatch(/\.hex-a-gone-cell-p2\s*\{[^}]*stroke:\s*#c62828/s);
    expect(css).toContain('drop-shadow(0 2px 4px rgba(25, 118, 210, 0.3))');
    expect(css).toContain('drop-shadow(0 2px 4px rgba(211, 47, 47, 0.3))');
  });
});
