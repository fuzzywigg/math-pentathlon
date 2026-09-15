/**
 * Wave 66 leftover after tip/#316 — Fab history-list max-height scoped.
 * Wave61 soft flex/gap; lock max-height 200px leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject history-list maxheight scoped', () => {
  it('history-list caps at 200px with overflow-y auto', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-history-list\s*\{[\s\S]*?max-height:\s*200px[\s\S]*?overflow-y:\s*auto/
    );
  });
});
