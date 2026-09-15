/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style block-btn-gradient. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style block-btn-gradient', () => {
  it('.hex-a-gone-block-btn locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-block-btn\s*\{[^}]*linear-gradient\(135deg, #ffffff 0%, #f7fafc 100%\)/s);
  });
});
