/**
 * Wave 68 leftover after tip/#336 — Hex legend-item pad + bg exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style legend-item pad bg', () => {
  it('hex-legend-item padding 6px 12px + bg 0.04', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-legend-item\s*\{[^}]*padding:\s*6px 12px/s);
    expect(css).toMatch(/\.hex-legend-item\s*\{[^}]*background:\s*rgba\(0, 0, 0, 0\.04\)/s);
  });
});
