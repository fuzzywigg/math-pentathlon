/**
 * Wave 64 leftover after #305 — Fab .fab-score padding chrome.
 * Wave61 pins flex/gap/weight; deepen 0.5rem 1rem pad leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 64 fab — inject score pad exact', () => {
  it('score row uses 0.5rem 1rem padding', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-score');
    expect(css).toContain('padding: 0.5rem 1rem');
  });
});
