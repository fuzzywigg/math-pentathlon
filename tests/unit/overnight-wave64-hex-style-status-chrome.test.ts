/**
 * Wave 64 leftover after tip/#303 — Hex .hex-status chrome exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 hex — style status chrome', () => {
  it('hex-status padding / border-radius / box-shadow exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-status {');
    expect(css).toMatch(/\.hex-status\s*\{[^}]*padding:\s*12px 20px/s);
    expect(css).toMatch(/\.hex-status\s*\{[^}]*border-radius:\s*12px/s);
    expect(css).toMatch(/\.hex-status\s*\{[^}]*box-shadow:\s*0 2px 8px rgba\(0, 0, 0, 0\.08\)/s);
  });
});
