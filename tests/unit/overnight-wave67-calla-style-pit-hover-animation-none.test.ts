/**
 * Wave 67 leftover after tip/#316 — Calla valid-pit hover animation:none.
 * Wave66 locked hover scale/#6a4a32; lock animation:none leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pit hover animation none', () => {
  it('valid-pit hover clears pulse animation', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-pit-valid:hover \.calla-pit-circle\s*\{[^}]*animation:\s*none/s
    );
    expect(css).toContain('drop-shadow(0 0 12px rgba(72, 187, 120, 0.7))');
  });
});
