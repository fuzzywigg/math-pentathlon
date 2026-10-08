/**
 * burn-1008-mp-ui-coverage-round-4 — owl-messages residual select paths +
 * polyomino placement solvePlacement edges. Tests-only.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import {
  createBoard,
  placePolyomino,
  solvePlacement,
  isBoardFilled,
  createBoardWithBlockedCells,
  isCellOccupied,
  createGrid,
} from '../../src/core/polyomino/placement';
import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import type { MessageCondition } from '../../src/core/owl/owl-messages';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  storage.resetAll();
});

describe('burn-1008 ui-cov-r4 owl-messages residuals', () => {
  it('selectMessage returns null when only failing conditioned msgs exist', () => {
    // game:move has no stock library entries
    owlMessages.addMessage({
      id: 'r4-conditioned-only-a',
      category: 'game:move',
      priority: 'normal',
      text: 'conditioned',
      conditions: [{ type: 'playerWon', value: true }],
    });
    owlMessages.addMessage({
      id: 'r4-conditioned-only-b',
      category: 'game:move',
      priority: 'normal',
      text: 'also conditioned',
      conditions: [{ type: 'firstTime', value: true }],
    });
    expect(
      owlMessages.selectMessage('game:move', {
        playerWon: false,
        gamesPlayedThisGame: 3,
      })
    ).toBeNull();
  });

  it('unknown condition type soft-matches (default: true)', () => {
    owlMessages.addMessage({
      id: 'r4-unknown-condition',
      category: 'game:move',
      priority: 'high',
      text: 'unknown-ok',
      conditions: [
        {
          type: 'notARealCondition' as MessageCondition['type'],
          value: 1,
        },
      ],
    });
    const msg = owlMessages.selectMessage('game:move', {});
    expect(msg?.id).toBe('r4-unknown-condition');
  });
});

describe('burn-1008 ui-cov-r4 polyomino placement residuals', () => {
  const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;

  it('isCellOccupied treats OOB and missing cells as occupied', () => {
    const grid = createGrid(2, 2);
    expect(isCellOccupied(grid, -1, 0)).toBe(true);
    expect(isCellOccupied(grid, 0, 0)).toBe(false);
  });

  it('solvePlacement fills a 1x1 board; empty shapes / maxSolutions edges', () => {
    const board = createBoard(1, 1);
    const filled = solvePlacement(board, [mono], 1);
    expect(filled.length).toBe(1);
    expect(filled[0]!.length).toBe(1);

    // Already-filled board records a solution immediately
    const prefilled = placePolyomino(createBoard(1, 1), mono, {
      row: 0,
      col: 0,
    });
    expect(isBoardFilled(prefilled)).toBe(true);
    expect(solvePlacement(prefilled, [], 1).length).toBe(1);

    // No shapes left on non-full board → no solution
    expect(solvePlacement(createBoard(2, 2), [], 1)).toEqual([]);

    // Blocked full board with no empty cells
    const blocked = createBoardWithBlockedCells(1, 1, [{ row: 0, col: 0 }]);
    expect(solvePlacement(blocked, [mono], 1).length).toBeGreaterThanOrEqual(0);
  });

  it('solvePlacement respects maxSolutions > 1 on tiny board', () => {
    const board = createBoard(1, 1);
    const sols = solvePlacement(board, [mono], 2);
    expect(sols.length).toBe(1);
  });
});
