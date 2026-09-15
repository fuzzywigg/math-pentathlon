/**
 * Wave 66 leftover after tip/#316 — Fab AI-seat answer-player1 violet scoped.
 * Wave55 soft selector; wave65 default violet; lock seat p1 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject ai-seat answer p1 violet', () => {
  it('player1 AI seat remaps answer-player1 to #ddd6fe', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\[data-opponent="ai"\]\[data-ai-seat="player1"\] \.fab-answer-player1\s*\{[\s\S]*?background:\s*#ddd6fe/
    );
  });
});
