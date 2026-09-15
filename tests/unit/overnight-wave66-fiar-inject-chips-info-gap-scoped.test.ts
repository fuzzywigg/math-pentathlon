/**
 * Wave 66 leftover after tip/#316 — FIAR chips-info gap scoped.
 * Soft chips-info existed; lock gap 2rem leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 66 fiar — inject chips-info gap scoped', () => {
  it('chips-info is flex centered with 2rem gap', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-chips-info\s*\{[\s\S]*?display:\s*flex[\s\S]*?justify-content:\s*center[\s\S]*?gap:\s*2rem/
    );
  });
});
