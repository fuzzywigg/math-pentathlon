/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Calla score-active seat gradients.
 * Soft .active class elsewhere; lock P1/P2 gradient leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style score-active seats', () => {
  it('pins score-p1/p2.active gradient + box-shadow leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)');
    expect(css).toContain('linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)');
    expect(css).toContain('box-shadow: 0 4px 12px rgba(25, 118, 210, 0.25)');
    expect(css).toContain('box-shadow: 0 4px 12px rgba(211, 47, 47, 0.25)');
  });
});
