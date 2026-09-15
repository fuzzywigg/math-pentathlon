/**
 * Wave 67 leftover after tip/#323/#324 — valid pit fill + cursor.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pit valid fill cursor', () => {
  it('valid pit fills #5a3a22 with pointer cursor and stroke-width 3', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-pit-valid \.calla-pit-circle\s*\{[^}]*fill:\s*#5a3a22/s);
    expect(css).toMatch(/\.calla-pit-valid \.calla-pit-circle\s*\{[^}]*cursor:\s*pointer/s);
    expect(css).toMatch(/\.calla-pit-valid \.calla-pit-circle\s*\{[^}]*stroke-width:\s*3/s);
  });
});
