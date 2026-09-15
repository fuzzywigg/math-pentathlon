/**
 * Wave 68 leftover after tip/#336 — Hex winning filter 8px gold. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style winning filter 8px', () => {
  it('hex-cell-winning filter 8px gold exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))');
  });
});
