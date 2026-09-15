/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-cell-p2 stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style p2-stroke-b71c', () => {
  it('.hex-cell-p2 locks stroke: #b71c1c exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-p2');
    expect(css).toMatch(/\.hex-cell-p2\s*\{[^}]*stroke:\s*#b71c1c/s);
  });
});
