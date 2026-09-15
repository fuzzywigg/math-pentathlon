/**
 * Wave 67 leftover after tip/#336 — Fab score-value 1.25rem bold.
 * Soft 1.25rem; lock .fab-score-value leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject score-value 1.25rem', () => {
  it('score-value is 1.25rem bold', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-score-value\s*\{[\s\S]*?font-size:\s*1\.25rem[\s\S]*?font-weight:\s*bold/
    );
  });
});
