/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Par 55 history seat tint fills.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 58 par55 — inject history seat tints', () => {
  it('history move player1/2 tint leftovers', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('.par55-history-move.player1');
    expect(css).toContain('rgba(33,150,243,0.1)');
    expect(css).toContain('.par55-history-move.player2');
    expect(css).toContain('rgba(244,67,54,0.1)');
  });
});
