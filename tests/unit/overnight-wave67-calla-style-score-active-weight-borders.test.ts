/**
 * Wave 67 leftover after tip/#316 — Calla score.active weight + seat borders.
 * Wave66 locked gradients/scale; lock font-weight + box-shadow/border leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style score active weight borders', () => {
  it('active score uses weight 600 and seat box-shadow/border leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-score\.active\s*\{[^}]*font-weight:\s*600/s);
    expect(css).toContain('0 4px 12px rgba(25, 118, 210, 0.25)');
    expect(css).toContain('0 4px 12px rgba(211, 47, 47, 0.25)');
    expect(css).toContain('border-color: rgba(66, 165, 245, 0.4)');
    expect(css).toContain('border-color: rgba(239, 83, 80, 0.4)');
  });
});
