/**
 * Wave 67 leftover after tip/#316 — Calla pit-circle stroke + fallback fill.
 * Soft pit mount existed; lock stroke #2d1a0a / fallback #4a2c16 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pit-circle stroke fallback', () => {
  it('pit-circle uses #2d1a0a stroke and #4a2c16 fallback fill', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-pit-circle\s*\{[^}]*stroke:\s*#2d1a0a/s);
    expect(css).toMatch(/\.calla-pit-circle\s*\{[^}]*stroke-width:\s*2/s);
    expect(css).toContain('fill: #4a2c16');
  });
});
