/**
 * Wave 66 leftover after tip/#316 — Fab controls gap scoped.
 * Wave61 soft gap; lock .fab-controls leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject controls gap scoped', () => {
  it('controls are centered with 1rem gap', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-controls\s*\{[\s\S]*?justify-content:\s*center[\s\S]*?gap:\s*1rem/
    );
  });
});
