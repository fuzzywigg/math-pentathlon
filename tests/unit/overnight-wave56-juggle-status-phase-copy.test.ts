/**
 * Wave 56 leftover after #256 — Juggle controller phase instruction copy.
 * Distinct from wave27 fuzzy status length. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { initGame } from '../../src/games/juggle/game-controller';

describe('Wave 56 juggle — status phase copy', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
  });

  it('opens rolling with exact Roll the dice instruction', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(status.textContent).toMatch(/Roll the dice/);
    expect(status.querySelector('.juggle-status.player1')).toBeTruthy();
  });

  it('after roll shows die category instruction', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    (
      board.querySelector('.juggle-roll-btn') as HTMLButtonElement
    ).click();
    expect(status.textContent).toMatch(
      /Click a die to choose shape category/
    );
  });
});
