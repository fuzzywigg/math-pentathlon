/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone valid stroke-width 2.5. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style valid stroke width', () => {
  it('valid stroke #4caf50 + stroke-width 2.5 + hexValidPulse', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-cell-valid\s*\{[^}]*stroke:\s*#4caf50/s);
    expect(css).toMatch(/\.hex-a-gone-cell-valid\s*\{[^}]*stroke-width:\s*2\.5/s);
    expect(css).toContain('animation: hexValidPulse 2s ease-in-out infinite');
  });
});
