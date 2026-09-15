/**
 * Wave 66 leftover after tip/#316 — Calla board-bg stroke + fallback fill.
 * Soft rx attrs existed; lock CSS stroke/fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style board-bg stroke', () => {
  it('board-bg stroke #4a2c0f width 5 and fallback #7a4015', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('stroke: #4a2c0f');
    expect(css).toContain('stroke-width: 5');
    expect(css).toContain('fill: #7a4015');
  });
});
