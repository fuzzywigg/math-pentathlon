/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone block selected/empty chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 hexagone — style block selected empty', () => {
  it('selected border #48bb78; empty opacity/grayscale', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-block-btn.selected');
    expect(css).toContain('.hex-a-gone-block-btn.empty');
    expect(css).toMatch(/\.hex-a-gone-block-btn\.selected\s*\{[^}]*border-color:\s*#48bb78/s);
    expect(css).toMatch(/\.hex-a-gone-block-btn\.empty\s*\{[^}]*opacity:\s*0\.4/s);
    expect(css).toContain('filter: grayscale(0.5)');
  });
});
