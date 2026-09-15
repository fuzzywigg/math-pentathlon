/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-cell-empty:hover stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style empty-hover-stroke-7a', () => {
  it('.hex-cell-empty:hover locks stroke: #7a6448 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-empty:hover');
    expect(css).toMatch(/\.hex-cell-empty:hover\s*\{[^}]*stroke:\s*#7a6448/s);
  });
});
