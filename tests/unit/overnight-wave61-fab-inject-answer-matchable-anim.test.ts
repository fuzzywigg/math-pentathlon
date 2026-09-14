/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab answer-matchable anim class.
 * Wave58 pins pulse keyframe body; deepen matchable selector leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject answer-matchable anim', () => {
  it('matchable uses fab-pulse animation infinite', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-answer-matchable');
    expect(css).toContain('animation: fab-pulse 1s ease-in-out infinite');
  });
});
