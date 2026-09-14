/**
 * Wave 49 — Kings board phase class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — phase class', () => {
  it('adds phase-moveKing', () => {
    const box = document.createElement('div');
    renderBoard(createInitialGameState(), box);
    expect(box.querySelector('.board')?.classList.contains('phase-moveKing')).toBe(true);
  });
});
