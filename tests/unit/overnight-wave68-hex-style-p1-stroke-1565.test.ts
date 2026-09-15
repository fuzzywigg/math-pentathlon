/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-cell-p1 stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style p1-stroke-1565', () => {
  it('.hex-cell-p1 locks stroke: #1565c0 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-p1');
    expect(css).toMatch(/\.hex-cell-p1\s*\{[^}]*stroke:\s*#1565c0/s);
  });
});
