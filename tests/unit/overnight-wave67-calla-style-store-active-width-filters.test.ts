/**
 * Wave 67 leftover after tip/#316 — Calla store-active width + seat filters.
 * Wave66 locked seat strokes; lock stroke-width 4 + drop-shadow leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style store-active width filters', () => {
  it('active store uses stroke-width 4 and seat drop-shadows', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-store-active \.calla-store-rect\s*\{[^}]*stroke-width:\s*4/s
    );
    expect(css).toContain('drop-shadow(0 0 8px rgba(66, 165, 245, 0.4))');
    expect(css).toContain('drop-shadow(0 0 8px rgba(239, 83, 80, 0.4))');
  });
});
