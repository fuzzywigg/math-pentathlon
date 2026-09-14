/**
 * Wave 42 leftovers B — Handshake hex winning path × kings evaluate × fiar dirs.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createEmptyBoard } from '../../src/games/hex/types';
import { getWinningPath, checkWinner } from '../../src/games/hex/rules';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { evaluatePosition } from '../../src/games/kings-quadraphages/ai';
import { createFiarBoard, getDirections } from '../../src/games/fiar/types';

describe('Wave 42 handshake — hex path × kings eval × fiar dirs', () => {
  it('hex column win path; kings eval finite; fiar 8 dirs', () => {
    const board = createEmptyBoard(4);
    for (let r = 0; r < 4; r++) board[r][0] = 'player1';
    expect(checkWinner(board, 'player1', 4)).toBe(true);
    expect(getWinningPath(board, 'player1', 4).length).toBeGreaterThanOrEqual(4);

    const score = evaluatePosition(createInitialGameState(), 'player1');
    expect(Number.isFinite(score)).toBe(true);

    expect(getDirections()).toHaveLength(8);
    expect(createFiarBoard().nodes.size).toBe(25);
  });
});
