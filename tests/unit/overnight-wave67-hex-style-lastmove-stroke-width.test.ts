/**
 * Wave 67 leftover after tip/#324 — Hex last-move stroke-width 2.5. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style lastmove stroke-width', () => {
  it('hex-cell-last-move stroke-width 2.5 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-cell-last-move\s*\{[^}]*stroke-width:\s*2\.5/s);
    expect(css).toContain('stroke: #ff9800');
  });
});
