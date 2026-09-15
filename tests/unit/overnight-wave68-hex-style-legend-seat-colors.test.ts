/**
 * Wave 68 leftover after tip/#336 — Hex legend-p1/p2 colors exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style legend seat colors', () => {
  it('legend-p1 1976d2 + legend-p2 c62828', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-legend-p1\s*\{[^}]*color:\s*#1976d2/s);
    expect(css).toMatch(/\.hex-legend-p2\s*\{[^}]*color:\s*#c62828/s);
  });
});
