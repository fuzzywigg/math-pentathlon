/**
 * Wave 67 leftover after tip/#336 — Fab controls gap 1rem.
 * Wave61 controls soft; lock gap 1rem leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject controls gap 1rem', () => {
  it('controls flex with gap 1rem', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-controls\s*\{[\s\S]*?display:\s*flex[\s\S]*?gap:\s*1rem/
    );
  });
});
