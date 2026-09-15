/**
 * Wave 65 leftover after tip/#313 — Hex .hex-legend-p1 border-left. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style legend-p1 border-left', () => {
  it('legend-p1 border-left 3px #42a5f5', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-legend-p1\s*\{[^}]*border-left:\s*3px solid #42a5f5/s);
  });
});
