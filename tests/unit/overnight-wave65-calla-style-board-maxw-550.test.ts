/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla style.css board max-width.
 * Tutorials covered by open #315; lock unsaturated style chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style board max-width 550', () => {
  it('pins .calla-board max-width 550px + drop-shadow leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-board\s*\{[^}]*max-width:\s*550px/);
    expect(css).toMatch(
      /\.calla-board\s*\{[^}]*filter:\s*drop-shadow\(0 6px 16px rgba\(0, 0, 0, 0\.2\)\)/
    );
  });
});
