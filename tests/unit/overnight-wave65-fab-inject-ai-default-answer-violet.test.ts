/**
 * Wave 65 leftover after tip/#305 — Fab AI-default answer-player2 violet.
 * Soft #ddd6fe existed; lock default (no seat) answer remap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 65 fab — inject ai default answer violet', () => {
  it('pins [data-opponent=ai] .fab-answer-player2 #ddd6fe without seat', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\[data-opponent="ai"\] \.fab-answer-player2\s*\{[\s\S]*?background:\s*#ddd6fe/
    );
  });
});
