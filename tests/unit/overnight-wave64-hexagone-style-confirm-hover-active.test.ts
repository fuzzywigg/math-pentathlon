/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone confirm hover/active chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 64 hexagone — style confirm hover active', () => {
  it('confirm-btn:hover lift + active reset shadows', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-confirm-btn:hover');
    expect(css).toContain('.hex-a-gone-confirm-btn:active');
    expect(css).toContain('box-shadow: 0 6px 16px rgba(72, 187, 120, 0.4)');
    expect(css).toMatch(/\.hex-a-gone-confirm-btn:hover\s*\{[^}]*transform:\s*translateY\(-2px\)/s);
  });
});
