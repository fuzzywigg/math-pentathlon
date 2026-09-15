/**
 * Wave 67 leftover after tip/#324 — Hex edge linejoin + drop-shadow. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style edge linejoin shadow', () => {
  it('hex-edge stroke-linejoin round + drop-shadow', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-edge\s*\{[^}]*stroke-linejoin:\s*round/s);
    expect(css).toContain('drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))');
  });
});
