/**
 * Wave 67 leftover after tip/#323/#324 — pit-circle stroke chrome.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pit-circle stroke', () => {
  it('pit-circle strokes #2d1a0a width 2', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-pit-circle\s*\{[^}]*stroke:\s*#2d1a0a/s);
    expect(css).toMatch(/\.calla-pit-circle\s*\{[^}]*stroke-width:\s*2/s);
  });
});
