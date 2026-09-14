/**
 * Wave 53 leftover after #235 — Fab styles matchable pulse leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 53 fab — inject matchable pulse', () => {
  it('CSS blob includes matchable / pulse / winner banner', () => {
    injectFabStyles();
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(document.querySelectorAll('#fab-styles')).toHaveLength(1);
    expect(css).toContain('.fab-answer-matchable');
    expect(css).toContain('@keyframes fab-pulse');
    expect(css).toContain('.fab-winner-banner');
  });
});
