/**
 * Wave 67 leftover after tip/#316 — Calla valid-pit fill/cursor leftovers.
 * Wave66 locked #48bb78 pulse; lock fill #5a3a22 + cursor leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pit valid fill cursor', () => {
  it('valid pit uses #5a3a22 fill, stroke-width 3, cursor pointer', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-pit-valid \.calla-pit-circle\s*\{[^}]*fill:\s*#5a3a22/s
    );
    expect(css).toMatch(
      /\.calla-pit-valid \.calla-pit-circle\s*\{[^}]*stroke-width:\s*3/s
    );
    expect(css).toMatch(
      /\.calla-pit-valid \.calla-pit-circle\s*\{[^}]*cursor:\s*pointer/s
    );
  });
});
