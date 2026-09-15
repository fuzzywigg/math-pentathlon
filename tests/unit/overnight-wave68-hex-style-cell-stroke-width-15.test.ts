/**
 * Wave 68 leftover after tip/#334 — Hex style .hex-cell stroke-width. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hex — style cell-stroke-width-15', () => {
  it('.hex-cell locks stroke-width: 1.5 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell');
    expect(css).toMatch(/\.hex-cell\s*\{[^}]*stroke-width:\s*1\.5/s);
  });
});
