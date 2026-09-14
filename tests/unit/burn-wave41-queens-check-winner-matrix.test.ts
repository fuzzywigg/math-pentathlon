/**
 * Wave 41 — Queens & Guards checkWinner partial / wrong-type / opp matrix.
 * Deepens wave35 center settle. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { checkWinner } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  type QueensGuardsState,
} from '../../src/games/queens-guards/types';

function surroundQueen(
  owner: 'player1' | 'player2',
  opts: {
    missingGuard?: number;
    wrongTypeAt?: number;
    enemyGuardAt?: number;
    noQueen?: boolean;
  } = {}
): QueensGuardsState {
  const state = createInitialState();
  const cells = new Map(state.cells);
  if (!opts.noQueen) {
    cells.set(cellKey(0, 0), {
      ...cells.get(cellKey(0, 0))!,
      piece: { id: 'q', player: owner, type: 'queen' },
    });
  }
  for (let pos = 0; pos < 6; pos++) {
    if (opts.missingGuard === pos) {
      cells.set(cellKey(1, pos), {
        ...cells.get(cellKey(1, pos))!,
        piece: null,
      });
      continue;
    }
    let type: 'queen' | 'guard' = 'guard';
    let player = owner;
    if (opts.wrongTypeAt === pos) type = 'queen';
    if (opts.enemyGuardAt === pos) player = owner === 'player1' ? 'player2' : 'player1';
    cells.set(cellKey(1, pos), {
      ...cells.get(cellKey(1, pos))!,
      piece: { id: `g${pos}`, player, type },
    });
  }
  return { ...state, cells };
}

describe('Wave 41 queens — checkWinner matrix', () => {
  it('full surround → owner wins', () => {
    expect(checkWinner(surroundQueen('player1'))).toBe('player1');
    expect(checkWinner(surroundQueen('player2'))).toBe('player2');
  });

  it('missing guard / wrong type / enemy guard → null', () => {
    expect(checkWinner(surroundQueen('player1', { missingGuard: 3 }))).toBeNull();
    expect(checkWinner(surroundQueen('player1', { wrongTypeAt: 2 }))).toBeNull();
    expect(checkWinner(surroundQueen('player1', { enemyGuardAt: 1 }))).toBeNull();
  });

  it('no queen at center → null even with guards', () => {
    expect(checkWinner(surroundQueen('player1', { noQueen: true }))).toBeNull();
  });

  it('opening position is never a winner', () => {
    expect(checkWinner(createInitialState())).toBeNull();
  });
});
