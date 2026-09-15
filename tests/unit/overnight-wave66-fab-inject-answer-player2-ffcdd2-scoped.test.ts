/**
 * Wave 66 leftover after tip/#316 — Fab answer-player2 #ffcdd2 scoped.
 * Soft seat fill existed; lock .fab-answer-player2 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject answer-player2 ffcdd2 scoped', () => {
  it('answer-player2 fills #ffcdd2', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-answer-player2\s*\{[\s\S]*?background:\s*#ffcdd2/
    );
  });
});
