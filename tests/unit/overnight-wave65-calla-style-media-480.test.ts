/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla media 480 responsive.
 * Soft board max-width 550 elsewhere; lock 95vw / count sizes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style media 480', () => {
  it('pins @media 480px calla-board 95vw + count font sizes', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /@media \(max-width:\s*480px\)\s*\{[\s\S]*?\.calla-board\s*\{[^}]*max-width:\s*95vw/
    );
    expect(css).toMatch(
      /@media \(max-width:\s*480px\)\s*\{[\s\S]*?\.calla-pit-count\s*\{[^}]*font-size:\s*14px/
    );
    expect(css).toMatch(
      /@media \(max-width:\s*480px\)\s*\{[\s\S]*?\.calla-store-count\s*\{[^}]*font-size:\s*20px/
    );
  });
});
