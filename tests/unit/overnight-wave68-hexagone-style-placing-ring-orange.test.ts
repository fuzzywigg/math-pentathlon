/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style placing-ring-orange. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style placing-ring-orange', () => {
  it('.hex-a-gone-block-btn.placing locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-block-btn\.placing\s*\{[^}]*0 0 0 3px rgba\(237, 137, 54, 0\.2\)/s);
  });
});
