/**
 * Wave 67 leftover after tip/#316 — Calla store-rect stroke/rx/fallback.
 * Soft store chrome existed; lock #2d1a0a / rx 6 / #3a2515 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style store-rect stroke rx fallback', () => {
  it('store-rect uses #2d1a0a stroke, rx 6, fallback #3a2515', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-store-rect\s*\{[^}]*stroke:\s*#2d1a0a/s);
    expect(css).toMatch(/\.calla-store-rect\s*\{[^}]*rx:\s*6/s);
    expect(css).toContain('fill: #3a2515');
  });
});
