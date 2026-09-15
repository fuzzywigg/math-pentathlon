/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-cell-empty:hover fill. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style empty-hover-fill-e8', () => {
  it('.hex-cell-empty:hover locks fill: #e8e8c8 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-empty:hover');
    expect(css).toMatch(/\.hex-cell-empty:hover\s*\{[^}]*fill:\s*#e8e8c8/s);
  });
});
