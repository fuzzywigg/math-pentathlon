/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — FIAR status seat color vars.
 * Wave58 covers chip background vars; deepen status color: vars. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 59 fiar — inject status seat color vars', () => {
  it('status seats use player color text vars', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-status.player1');
    expect(css).toContain('color: var(--color-player1, #2196f3)');
    expect(css).toContain('.fiar-status.player2');
    expect(css).toContain('color: var(--color-player2, #f44336)');
  });
});
