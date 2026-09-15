/**
 * Wave 67 leftover after tip/#324 — Hex winning stroke-width 3. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hex — style winning stroke-width', () => {
  it('hex-cell-winning stroke-width 3 exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-cell-winning\s*\{[^}]*stroke-width:\s*3/s);
    expect(css).toContain('stroke: #ffd700');
  });
});
