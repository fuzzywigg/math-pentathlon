/**
 * Wave 66 leftover after tip/#316 — Calla last-move panel chrome exact.
 * Soft .calla-last-move mount existed; lock border/color leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style last-move chrome', () => {
  it('last-move borders #ed8936 and colors #c05621', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-last-move\s*\{[^}]*border:\s*2px solid #ed8936/s);
    expect(css).toMatch(/\.calla-last-move\s*\{[^}]*color:\s*#c05621/s);
    expect(css).toMatch(/\.calla-last-move\s*\{[^}]*border-radius:\s*10px/s);
  });
});
