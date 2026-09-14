/**
 * Wave 49 — Kings board has 81 cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — cell count', () => {
  it('renders 9x9 cells once', () => {
    const box = document.createElement('div');
    renderBoard(createInitialGameState(), box);
    expect(box.querySelectorAll('.cell').length).toBe(81);
    renderBoard(createInitialGameState(), box);
    expect(box.querySelectorAll('.cell').length).toBe(81);
  });
});
