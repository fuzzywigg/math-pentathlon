/**
 * Wave 65 leftover after tip/#313 — Hex .hex-cell-last-move stroke-width 2.5. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style lastmove stroke-width 2.5', () => {
  it('hex-cell-last-move stroke-width 2.5', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-cell-last-move\s*\{[^}]*stroke-width:\s*2\.5/s);
  });
});
