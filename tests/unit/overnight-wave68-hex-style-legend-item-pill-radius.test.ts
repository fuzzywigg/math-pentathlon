/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-legend-item border-radius. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style legend-item-pill-radius', () => {
  it('.hex-legend-item locks border-radius: 20px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-legend-item');
    expect(css).toMatch(/\.hex-legend-item\s*\{[^}]*border-radius:\s*20px/s);
  });
});
