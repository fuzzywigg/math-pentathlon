/**
 * Wave 45 TOKENMAXX — Queens checkWinner surround win leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  cellKey,
} from '../../src/games/queens-guards/types';
import { checkWinner } from '../../src/games/queens-guards/rules';

describe('Wave 45 queens — checkWinner surround', () => {
  it('null at opening; win when queen center + 6 own guards on ring1', () => {
    const open = createInitialState();
    expect(checkWinner(open)).toBeNull();

    const cells = new Map(open.cells);
    cells.set(cellKey(0, 0), {
      ring: 0,
      position: 0,
      piece: { id: 'p1-queen', player: 'player1', type: 'queen' },
    });
    for (let pos = 0; pos < 6; pos++) {
      cells.set(cellKey(1, pos), {
        ring: 1,
        position: pos,
        piece: { id: `p1-g-${pos}`, player: 'player1', type: 'guard' },
      });
    }
    expect(checkWinner({ ...open, cells })).toBe('player1');
  });

  it('null when center queen but ring1 has enemy/empty', () => {
    const open = createInitialState();
    const cells = new Map(open.cells);
    cells.set(cellKey(0, 0), {
      ring: 0,
      position: 0,
      piece: { id: 'p1-queen', player: 'player1', type: 'queen' },
    });
    for (let pos = 0; pos < 5; pos++) {
      cells.set(cellKey(1, pos), {
        ring: 1,
        position: pos,
        piece: { id: `p1-g-${pos}`, player: 'player1', type: 'guard' },
      });
    }
    cells.set(cellKey(1, 5), {
      ring: 1,
      position: 5,
      piece: { id: 'p2-g', player: 'player2', type: 'guard' },
    });
    expect(checkWinner({ ...open, cells })).toBeNull();
  });
});
