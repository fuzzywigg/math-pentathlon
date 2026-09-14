/**
 * Wave 63 leftover after #301 — Hex cell-p2 stroke #b71c1c residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 63 hex — style p2 stroke', () => {
  it('pins .hex-cell-p2 stroke #b71c1c leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-p2');
    expect(css).toContain('stroke: #b71c1c');
  });
});
