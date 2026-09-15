/**
 * Wave 67 leftover after tip/#336 — Fab answer-matchable pulse animation.
 * Soft matchable; lock fab-pulse animation leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject answer-matchable pulse anim', () => {
  it('answer-matchable runs fab-pulse infinite', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-answer-matchable\s*\{[\s\S]*?animation:\s*fab-pulse 1s ease-in-out infinite/
    );
  });
});
