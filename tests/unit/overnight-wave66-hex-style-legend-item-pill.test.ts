/**
 * Wave 66 leftover after tip/#316 — Hex .hex-legend-item pill chrome exact.
 * Soft legend gap; lock item radius/padding leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hex — style legend item pill', () => {
  it('legend-item border-radius 20px + padding/gap exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-legend-item {');
    expect(css).toMatch(/\.hex-legend-item\s*\{[^}]*border-radius:\s*20px/s);
    expect(css).toMatch(/\.hex-legend-item\s*\{[^}]*padding:\s*6px 12px/s);
    expect(css).toMatch(/\.hex-legend-item\s*\{[^}]*gap:\s*6px/s);
  });
});
