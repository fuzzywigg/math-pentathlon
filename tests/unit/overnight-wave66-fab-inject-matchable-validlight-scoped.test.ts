/**
 * Wave 66 leftover after tip/#316 — Fab answer-matchable #c8e6c9 scoped.
 * Soft validLight existed; lock .fab-answer-matchable leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject matchable validlight scoped', () => {
  it('matchable fills #c8e6c9 with fab-pulse', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-answer-matchable\s*\{[\s\S]*?background:\s*#c8e6c9[\s\S]*?animation:\s*fab-pulse 1s ease-in-out infinite/
    );
  });
});
