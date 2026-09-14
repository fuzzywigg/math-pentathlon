/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro history tints + target panel.
 * Distinct from wave57 target-info DOM strong copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 60 kwatro — inject history / target chrome', () => {
  it('history seat tints and target-info #f5f5f5', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toContain('.kwa-history-move.player1');
    expect(css).toContain('background: rgba(33,150,243,0.1)');
    expect(css).toContain('.kwa-history-move.player2');
    expect(css).toContain('background: rgba(244,67,54,0.1)');
    expect(css).toContain('.kwa-target-info');
    expect(css).toContain('background: #f5f5f5');
  });
});
