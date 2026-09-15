/**
 * Wave 66 leftover after tip/#316 — Fab AI-seat answer p2 restore scoped.
 * Wave58 soft #ffcdd2; lock seat remap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject ai-seat answer p2 restore scoped', () => {
  it('player1 AI seat restores answer-player2 #ffcdd2', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\[data-opponent="ai"\]\[data-ai-seat="player1"\] \.fab-answer-player2\s*\{[\s\S]*?background:\s*#ffcdd2/
    );
  });
});
