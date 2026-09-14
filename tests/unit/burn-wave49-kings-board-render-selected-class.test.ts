/**
 * Wave 49 — Kings renderBoard selected class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState, selectKing } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — selected class', () => {
  it('marks selected king cell', () => {
    const box = document.createElement('div');
    const s = selectKing(createInitialGameState());
    renderBoard(s, box);
    const selected = box.querySelector('.cell-selected');
    expect(selected).toBeTruthy();
    expect(selected?.classList.contains('cell-king')).toBe(true);
  });
});
