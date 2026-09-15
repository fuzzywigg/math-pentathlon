/**
 * Wave 67 leftover after tip/#316 — Calla last-move pad/gradient/font leftovers.
 * Wave66 locked border/color/radius; lock pad + gradient + font leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style last-move pad gradient font', () => {
  it('last-move uses pad/gradient/font-size/weight leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.calla-last-move\s*\{[^}]*padding:\s*0\.6rem 1\.25rem/s
    );
    expect(css).toContain('rgba(237, 137, 54, 0.08) 0%');
    expect(css).toContain('rgba(237, 137, 54, 0.15) 100%');
    expect(css).toMatch(/\.calla-last-move\s*\{[^}]*font-size:\s*0\.9rem/s);
    expect(css).toMatch(/\.calla-last-move\s*\{[^}]*font-weight:\s*500/s);
  });
});
