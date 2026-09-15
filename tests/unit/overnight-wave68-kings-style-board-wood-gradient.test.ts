/**
 * Wave 68 leftover after tip/#336 — Kings .board wood gradient exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 kings — style board wood gradient', () => {
  it('board locks 8b4513 wood gradient + 4px border', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.board\s*\{[^}]*background:\s*linear-gradient\(145deg, #8b4513/s);
    expect(css).toMatch(/\.board\s*\{[^}]*border:\s*4px solid #4a2c0f/s);
  });
});
