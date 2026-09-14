/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab score-p1 fill + seat var.
 * Wave56 pins answer-player1 #bbdefb; deepen score-p1 fill/var leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject score-p1 fill var', () => {
  it('score-p1 is #bbdefb with player1 color var', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-score-p1');
    expect(css).toContain('background: #bbdefb');
    expect(css).toContain('color: var(--color-player1, #2196f3)');
  });
});
