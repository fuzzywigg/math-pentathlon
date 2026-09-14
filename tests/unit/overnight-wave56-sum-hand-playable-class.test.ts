/**
 * Wave 56 leftover after #243 — Sum Dominoes hand playable class residual.
 * Selected/p1/p2 classes covered in wave49; playable glow was not. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/sum-dominoes/rules';
import { CONFIG, getDiceSum } from '../../src/games/sum-dominoes/types';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — hand playable class', () => {
  it('marks forged playable tile with .sd-hand-domino-playable', () => {
    const base = createInitialState();
    const dice: [number, number] = [3, 4];
    const seed = {
      id: 'seed-66',
      face1: 6,
      face2: 6,
      owner: null,
      orientation: 'horizontal' as const,
    };
    const playable = {
      id: 'force-61',
      face1: 6,
      face2: 1,
      owner: 'player1' as const,
      orientation: 'horizontal' as const,
    };
    const board = base.board.map((row) => row.map(() => null));
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = {
      domino: seed,
      position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
      orientation: 'horizontal',
    };
    const state = {
      ...base,
      board,
      hands: { ...base.hands, player1: [playable] },
      currentDice: dice,
      selectedDomino: null,
      phase: 'placing' as const,
      currentPlayer: 'player1' as const,
    };
    expect(getValidPlacements(state, playable, getDiceSum(dice)).length).toBeGreaterThan(0);
    const el = renderHand(state, 'player1', () => undefined);
    expect(el.querySelector('.sd-hand-domino-playable')).toBeTruthy();
  });
});
