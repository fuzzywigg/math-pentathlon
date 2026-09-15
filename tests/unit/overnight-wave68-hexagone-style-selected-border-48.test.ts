/**
 * Wave 68 leftover after tip/#334 — Hex-a-Gone style selected-border-48. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style selected-border-48', () => {
  it('.hex-a-gone-block-btn.selected locks residual chrome exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-block-btn\.selected\s*\{[^}]*border-color:\s*#48bb78/s);
  });
});
