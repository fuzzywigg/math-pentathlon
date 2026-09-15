/**
 * Wave 68 leftover after tip/#336 — Hex hexCellPlace keyframe scale. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style place keyframe scale', () => {
  it('hexCellPlace locks 0.8→1.1→1 scale + 0.3s ease-out', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('animation: hexCellPlace 0.3s ease-out');
    expect(css).toContain('@keyframes hexCellPlace');
    expect(css).toContain('transform: scale(0.8)');
    expect(css).toContain('transform: scale(1.1)');
  });
});
