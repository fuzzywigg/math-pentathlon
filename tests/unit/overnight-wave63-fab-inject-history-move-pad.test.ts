/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab history-move padding.
 * Wave61 pins history-move type; deepen 0.25rem 0.5rem pad leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 63 fab — inject history-move pad', () => {
  it('history move rows use 0.25rem 0.5rem padding', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-history-move');
    expect(css).toContain('padding: 0.25rem 0.5rem');
  });
});
