/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style valid-hover-10px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style valid-hover-10px', () => {
  it('.hex-a-gone-cell-valid:hover locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-cell-valid:hover\s*\{[^}]*drop-shadow\(0 0 10px rgba\(76, 175, 80, 0\.7\)\)/s);
  });
});
