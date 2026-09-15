/**
 * Wave 66 leftover after tip/#316 — Fab answer-player1 #bbdefb scoped.
 * Soft seat fill existed; lock .fab-answer-player1 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject answer-player1 bbdefb scoped', () => {
  it('answer-player1 fills #bbdefb', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-answer-player1\s*\{[\s\S]*?background:\s*#bbdefb/
    );
  });
});
