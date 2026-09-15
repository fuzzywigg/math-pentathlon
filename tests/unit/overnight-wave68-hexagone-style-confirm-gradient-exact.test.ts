/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style confirm-gradient-exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style confirm-gradient-exact', () => {
  it('.hex-a-gone-confirm-btn locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-confirm-btn\s*\{[^}]*linear-gradient\(135deg, #48bb78 0%, #38a169 50%, #2f855a 100%\)/s);
  });
});
