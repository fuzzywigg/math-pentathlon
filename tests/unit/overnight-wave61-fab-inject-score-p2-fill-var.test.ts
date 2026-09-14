/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab score-p2 fill + seat var.
 * Distinct from AI-seat #ddd6fe paths; deepen human Red score chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject score-p2 fill var', () => {
  it('score-p2 is #ffcdd2 with player2 color var', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-score-p2');
    expect(css).toContain('background: #ffcdd2');
    expect(css).toContain('color: var(--color-player2, #f44336)');
  });
});
