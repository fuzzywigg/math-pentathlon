/**
 * Wave 69 leftover after tip/#350 — Star Track draw-btn pad/size/gradient.
 * Soft Draw Chains label existed; lock style.css leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 69 star-track — style draw-btn gradient', () => {
  it('draw-btn pins pad, 1.2rem, green gradient, radius 10px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(
      /\.star-track-draw-btn\s*\{[^}]*padding:\s*16px 36px/s
    );
    expect(css).toMatch(
      /\.star-track-draw-btn\s*\{[^}]*font-size:\s*1\.2rem/s
    );
    expect(css).toContain(
      'linear-gradient(135deg, #48bb78 0%, #38a169 50%, #2f855a 100%)'
    );
    expect(css).toMatch(
      /\.star-track-draw-btn\s*\{[^}]*border-radius:\s*10px/s
    );
  });
});
