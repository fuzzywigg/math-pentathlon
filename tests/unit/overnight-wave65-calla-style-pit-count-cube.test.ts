/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla pit-count + cube chrome.
 * Soft cube render elsewhere; lock 18px / #b8860b leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style pit-count cube', () => {
  it('pins pit-count 18px text-shadow + cube stroke #b8860b', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-pit-count\s*\{[^}]*font-size:\s*18px/);
    expect(css).toContain('text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6)');
    expect(css).toMatch(/\.calla-cube\s*\{[^}]*stroke:\s*#b8860b/);
  });
});
