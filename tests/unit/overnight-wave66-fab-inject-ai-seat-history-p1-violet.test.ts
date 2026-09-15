/**
 * Wave 66 leftover after tip/#316 — Fab AI-seat history-player1 violet scoped.
 * Wave57 soft selector; lock seat p1 history leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject ai-seat history p1 violet', () => {
  it('player1 AI seat remaps history-player1 to #ddd6fe', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\[data-opponent="ai"\]\[data-ai-seat="player1"\] \.fab-history-player1\s*\{[\s\S]*?background:\s*#ddd6fe/
    );
  });
});
