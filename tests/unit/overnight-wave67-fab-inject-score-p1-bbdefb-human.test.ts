/**
 * Wave 67 leftover after tip/#336 — Fab score-p1 human #bbdefb.
 * AI seat score remap; lock human score-p1 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject score-p1 bbdefb human', () => {
  it('score-p1 fills #bbdefb for human', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(/\.fab-score-p1\s*\{[\s\S]*?background:\s*#bbdefb/);
  });
});
