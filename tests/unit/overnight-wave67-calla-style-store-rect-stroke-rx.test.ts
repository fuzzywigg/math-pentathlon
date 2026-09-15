/**
 * Wave 67 leftover after tip/#323/#324 — store-rect stroke + rx.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style store-rect stroke rx', () => {
  it('store-rect strokes #2d1a0a width 3 with rx 6', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-store-rect\s*\{[^}]*stroke:\s*#2d1a0a/s);
    expect(css).toMatch(/\.calla-store-rect\s*\{[^}]*stroke-width:\s*3/s);
    expect(css).toMatch(/\.calla-store-rect\s*\{[^}]*rx:\s*6/s);
  });
});
