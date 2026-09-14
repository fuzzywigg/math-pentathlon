/**
 * Wave 42 — Queens & Guards checkWinner surround leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { checkWinner } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  type QueensGuardsState,
} from '../../src/games/queens-guards/types';

function winPosition(
  owner: 'player1' | 'player2',
  opts: { missingGuard?: number; wrongOwnerAt?: number } = {}
): QueensGuardsState {
  const state = createInitialState();
  const cells = new Map(state.cells);
  cells.set(cellKey(0, 0), {
    ...cells.get(cellKey(0, 0))!,
    piece: { id: 'q-center', player: owner, type: 'queen' },
  });
  for (let pos = 0; pos < 6; pos++) {
    if (opts.missingGuard === pos) {
      cells.set(cellKey(1, pos), {
        ...cells.get(cellKey(1, pos))!,
        piece: null,
      });
      continue;
    }
    const player =
      opts.wrongOwnerAt === pos
        ? owner === 'player1'
          ? 'player2'
          : 'player1'
        : owner;
    cells.set(cellKey(1, pos), {
      ...cells.get(cellKey(1, pos))!,
      piece: { id: `g-${pos}`, player, type: 'guard' },
    });
  }
  return { ...state, cells };
}

describe('Wave 42 queens — checkWinner surround', () => {
  it('queen in center with six friendly guards wins for owner', () => {
    expect(checkWinner(winPosition('player1'))).toBe('player1');
    expect(checkWinner(winPosition('player2'))).toBe('player2');
  });

  it('missing guard in ring 1 yields null', () => {
    expect(checkWinner(winPosition('player1', { missingGuard: 4 }))).toBeNull();
  });

  it('wrong-owner guard in ring 1 yields null', () => {
    expect(checkWinner(winPosition('player1', { wrongOwnerAt: 2 }))).toBeNull();
  });

  it('opening board has no winner', () => {
    expect(checkWinner(createInitialState())).toBeNull();
  });
});
