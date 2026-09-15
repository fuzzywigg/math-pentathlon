/**
 * Wave 67 leftover after tip/#336 — Fab history-player1 human #bbdefb.
 * AI violet history; lock human p1 #bbdefb leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject history-player1 bbdefb', () => {
  it('history-player1 fills #bbdefb', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-history-player1\s*\{[\s\S]*?background:\s*#bbdefb/
    );
  });
});
