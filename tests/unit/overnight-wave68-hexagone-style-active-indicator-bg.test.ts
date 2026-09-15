/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone active indicator bg. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style active indicator bg', () => {
  it('player-indicator.active e3f2fd→bbdefb gradient + scale 1.02', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain(
      'background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
    );
    expect(css).toMatch(
      /\.hex-a-gone-players \.player-indicator\.active\s*\{[^}]*transform:\s*scale\(1\.02\)/s
    );
  });
});
