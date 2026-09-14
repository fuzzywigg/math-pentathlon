/**
 * Wave 60 leftover after #282 — Contig expr-points size/margin. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 60 contig — inject expr-points margin', () => {
  it('pins font-size and margin-top leftovers', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(/\.expr-points\s*\{[\s\S]*?font-size:\s*0\.9rem/);
    expect(css).toMatch(/\.expr-points\s*\{[\s\S]*?margin-top:\s*0\.25rem/);
  });
});
