/**
 * Wave 68 leftover after tip/#336 — Hex edge stroke-width 8 + linecap. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style edge width linecap', () => {
  it('hex-edge stroke-width 8 + linecap round', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-edge\s*\{[^}]*stroke-width:\s*8/s);
    expect(css).toMatch(/\.hex-edge\s*\{[^}]*stroke-linecap:\s*round/s);
  });
});
