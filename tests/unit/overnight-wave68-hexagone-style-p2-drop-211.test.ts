/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style p2-drop-211. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style p2-drop-211', () => {
  it('.hex-a-gone-cell-p2 locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-cell-p2\s*\{[^}]*drop-shadow\(0 2px 4px rgba\(211, 47, 47, 0\.3\)\)/s);
  });
});
