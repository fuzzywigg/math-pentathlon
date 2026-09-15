/**
 * Wave 66 leftover after tip/#316 — Hex legend-p1/p2 seat colors exact.
 * Soft legend-item classes; lock seat color leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 hex — style legend seat colors', () => {
  it('legend-p1 #1976d2 + legend-p2 #c62828 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-legend-p1\s*\{[^}]*color:\s*#1976d2/s);
    expect(css).toMatch(/\.hex-legend-p1\s*\{[^}]*border-left:\s*3px solid #42a5f5/s);
    expect(css).toMatch(/\.hex-legend-p2\s*\{[^}]*color:\s*#c62828/s);
    expect(css).toMatch(/\.hex-legend-p2\s*\{[^}]*border-left:\s*3px solid #ef5350/s);
  });
});
