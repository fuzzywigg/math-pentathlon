/**
 * Wave 63 leftover after #301 — Hex empty hover dark stroke #7a6448. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hex — style empty hover dark stroke', () => {
  it('pins empty hover stroke #7a6448 + scale leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-empty:hover');
    expect(css).toContain('stroke: #7a6448');
    expect(css).toContain('transform: scale(1.03)');
  });
});
