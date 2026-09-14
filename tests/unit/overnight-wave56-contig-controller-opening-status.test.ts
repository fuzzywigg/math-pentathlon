/**
 * Wave 56 leftover after #243 — Contig controller opening status residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame, newGameVsHuman } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
});

describe('Wave 56 contig — controller opening status', () => {
  it('shows polite Blue rolling instruction on init', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.getAttribute('role')).toBe('status');
    const copy = status.querySelector('.contig-status.player1')?.textContent ?? '';
    expect(copy).toMatch(/Blue's turn/);
    expect(copy).toMatch(/Roll the dice to start your turn/);
  });
});
