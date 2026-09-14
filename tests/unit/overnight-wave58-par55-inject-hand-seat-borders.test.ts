/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Par 55 hand seat border CSS vars.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPar55Styles } from '../../src/games/par-55/board-ui';

afterEach(() => {
  document.getElementById('par55-styles')?.remove();
});

describe('Wave 58 par55 — inject hand seat borders', () => {
  it('hand player1/2 borders use seat CSS vars leftover', () => {
    injectPar55Styles();
    const css = document.getElementById('par55-styles')?.textContent ?? '';
    expect(css).toContain('.par55-hand-player1');
    expect(css).toContain('border: 3px solid var(--color-player1, #2196f3)');
    expect(css).toContain('.par55-hand-player2');
    expect(css).toContain('border: 3px solid var(--color-player2, #f44336)');
  });
});
