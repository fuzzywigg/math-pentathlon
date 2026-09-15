/**
 * Wave 67 leftover after tip/#336 — Fab answer-player2 human #ffcdd2.
 * AI violet remap; lock human p2 #ffcdd2 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject answer-player2 ffcdd2', () => {
  it('answer-player2 fills #ffcdd2 for human seat', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(/\.fab-answer-player2\s*\{[\s\S]*?background:\s*#ffcdd2/);
  });
});
