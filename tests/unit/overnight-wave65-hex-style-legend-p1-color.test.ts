/**
 * Wave 65 leftover after tip/#313 — Hex .hex-legend-p1 color #1976d2. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style legend-p1 color', () => {
  it('legend-p1 color #1976d2', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-legend-p1\s*\{[^}]*color:\s*#1976d2/s);
  });
});
