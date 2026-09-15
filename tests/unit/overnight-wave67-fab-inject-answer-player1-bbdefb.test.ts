/**
 * Wave 67 leftover after tip/#316 — Fab answer-player1 human #bbdefb.
 * AI violet locked; lock human seat #bbdefb leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject answer-player1 bbdefb', () => {
  it('answer-player1 fills #bbdefb for human seat', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(/\.fab-answer-player1\s*\{[\s\S]*?background:\s*#bbdefb/);
  });
});
