/**
 * Wave 58 Contig/SD residual — Sum AI placing with null move does not pass. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { executeAITurn } from '../../src/games/sum-dominoes/ai';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';

describe('Wave 58 sum — AI placing null no pass', () => {
  it('keeps placing + passCount when hand unplayable', () => {
    const base = createInitialState();
    const unplayable = {
      id: 'u-00',
      face1: 0,
      face2: 0,
      owner: 'player2' as const,
      orientation: 'horizontal' as const,
    };
    const board = base.board.map((row) => row.map(() => null));
    board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = {
      domino: {
        id: 'seed-66',
        face1: 6,
        face2: 6,
        owner: null,
        orientation: 'horizontal',
      },
      position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
      orientation: 'horizontal',
    };
    const state = {
      ...base,
      board,
      hands: { player1: [], player2: [unplayable] },
      currentPlayer: 'player2' as const,
      currentDice: [1, 1] as [number, number],
      phase: 'placing' as const,
      passCount: 0,
      selectedDomino: null,
    };
    const next = executeAITurn(state, 'player2', 'hard');
    expect(next.phase).toBe('placing');
    expect(next.passCount).toBe(0);
  });
});
