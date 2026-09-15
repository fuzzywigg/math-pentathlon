/**
 * Wave 67 leftover after tip/#336 — Fab history-list max-height 200px.
 * Wave56 soft 200px; lock .fab-history-list leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject history-list maxheight 200', () => {
  it('history-list caps at max-height 200px', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(/\.fab-history-list\s*\{[\s\S]*?max-height:\s*200px/);
  });
});
