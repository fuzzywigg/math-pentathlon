/**
 * Wave 64 leftover after tip/#303 — Hex .hex-edge stroke-width 8. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 hex — style edge stroke width', () => {
  it('hex-edge stroke-width 8 + stroke-linecap round', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-edge {');
    expect(css).toMatch(/\.hex-edge\s*\{[^}]*stroke-width:\s*8/s);
    expect(css).toMatch(/\.hex-edge\s*\{[^}]*stroke-linecap:\s*round/s);
  });
});
