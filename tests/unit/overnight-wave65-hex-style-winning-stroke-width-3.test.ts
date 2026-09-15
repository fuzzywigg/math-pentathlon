/**
 * Wave 65 leftover after tip/#313 — Hex .hex-cell-winning stroke-width 3. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hex — style winning stroke-width 3', () => {
  it('hex-cell-winning stroke-width 3', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-cell-winning\s*\{[^}]*stroke-width:\s*3/s);
  });
});
