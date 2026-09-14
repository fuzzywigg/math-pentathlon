/**
 * Wave 65 leftover after tip/#305 — Fab AI-default history-player2 violet.
 * Soft history seat restore; lock default history-player2 #ddd6fe leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 65 fab — inject ai default history violet', () => {
  it('pins [data-opponent=ai] .fab-history-player2 #ddd6fe without seat', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\[data-opponent="ai"\] \.fab-history-player2\s*\{[\s\S]*?background:\s*#ddd6fe/
    );
  });
});
