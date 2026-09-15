/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style cell-drop-008. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style cell-drop-008', () => {
  it('.hex-a-gone-cell locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-cell\s*\{[^}]*drop-shadow\(0 1px 2px rgba\(0, 0, 0, 0\.08\)\)/s);
  });
});
