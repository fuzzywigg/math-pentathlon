/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-legend-item background. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style legend-item-bg-04', () => {
  it('.hex-legend-item locks background: rgba(0, 0, 0, 0.04) exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-legend-item');
    expect(css).toMatch(/\.hex-legend-item\s*\{[^}]*background:\s*rgba\(0, 0, 0, 0\.04\)/s);
  });
});
