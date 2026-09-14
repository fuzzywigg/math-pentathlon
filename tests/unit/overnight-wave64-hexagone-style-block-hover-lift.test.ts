/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone block hover lift chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 hexagone — style block hover lift', () => {
  it('hover:not(.empty) border #a0aec0 + translateY(-2px)', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-block-btn:hover:not(.empty)');
    expect(css).toContain('border-color: #a0aec0');
    expect(css).toMatch(
      /\.hex-a-gone-block-btn:hover:not\(\.empty\)\s*\{[^}]*transform:\s*translateY\(-2px\)/s
    );
    expect(css).toContain('min-width: 70px');
  });
});
