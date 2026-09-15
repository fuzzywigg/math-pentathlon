/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone block empty opacity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style block empty opacity', () => {
  it('block-btn.empty opacity 0.4 + grayscale 0.5 + not-allowed', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.hex-a-gone-block-btn\.empty\s*\{[^}]*opacity:\s*0\.4/s);
    expect(css).toContain('filter: grayscale(0.5)');
    expect(css).toContain('cursor: not-allowed');
  });
});
