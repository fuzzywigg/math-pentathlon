/**
 * Wave 66 leftover after tip/#316 — Hex last-move stroke-width exact.
 * Soft last-move #ff9800; lock stroke-width 2.5 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hex — style lastmove stroke width', () => {
  it('hex-cell-last-move stroke-width 2.5 + orange glow exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-cell-last-move\s*\{[^}]*stroke-width:\s*2\.5/s);
    expect(css).toContain('drop-shadow(0 0 4px rgba(255, 152, 0, 0.5))');
  });
});
