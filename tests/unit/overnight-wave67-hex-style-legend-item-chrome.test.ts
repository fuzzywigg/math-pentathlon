/**
 * Wave 67 leftover after tip/#324 — Hex legend-item chrome exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style legend-item chrome', () => {
  it('hex-legend-item gap 6px + radius 20px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-legend-item\s*\{[^}]*gap:\s*6px/s);
    expect(css).toMatch(/\.hex-legend-item\s*\{[^}]*border-radius:\s*20px/s);
    expect(css).toMatch(/\.hex-legend\s*\{[^}]*margin-top:\s*12px/s);
  });
});
