/**
 * Wave 67 leftover after tip/#316 — Calla arrow fill none + stroke-width.
 * Wave66 locked seat strokes/opacity; lock fill/stroke-width leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style arrow fill swidth', () => {
  it('arrow uses fill none and stroke-width 2.5', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-arrow\s*\{[^}]*fill:\s*none/s);
    expect(css).toMatch(/\.calla-arrow\s*\{[^}]*stroke-width:\s*2\.5/s);
  });
});
