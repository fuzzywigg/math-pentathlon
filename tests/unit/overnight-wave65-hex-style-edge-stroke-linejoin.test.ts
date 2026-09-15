/**
 * Wave 65 leftover after tip/#313 — Hex .hex-edge stroke-linejoin round. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style edge stroke-linejoin', () => {
  it('hex-edge stroke-linejoin round', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-edge\s*\{[^}]*stroke-linejoin:\s*round/s);
  });
});
