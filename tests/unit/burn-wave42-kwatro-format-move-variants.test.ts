/**
 * Wave 42 — Kwatro-Sinko formatMove with and without alignment from history. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  moveChip,
  formatMove,
} from '../../src/games/kwatro-sinko/rules';
import type { Chip, KwaMove } from '../../src/games/kwatro-sinko/types';

describe('Wave 42 kwatro-sinko — format move variants', () => {
  it('formatMove for a plain opening move shows chip value only', () => {
    const state = createInitialState();
    const moves = state.chips.get('p1-0')!;
    const after = moveChip(selectChip(state, 'p1-0'), 'n1-0');
    const move = after.moveHistory[0];

    expect(formatMove(move)).toBe(`Chip ${move.chip.value}`);
    expect(formatMove(move)).not.toContain('(');
    expect(moves.value).toBe(0);
  });

  it('formatMove appends alignment expression when present', () => {
    const chip: Chip = {
      id: 'x',
      value: 4,
      owner: 'player1',
      position: 'n2-1',
    };
    const aligned: KwaMove = {
      player: 'player1',
      chip,
      fromNode: 'n0-2',
      toNode: 'n2-1',
      alignment: {
        nodes: ['n2-0', 'n2-1', 'n2-2'],
        chips: [chip],
        expression: '2 + 4 - 2 = 4',
        result: 4,
      },
      moveNumber: 3,
    };
    expect(formatMove(aligned)).toBe('Chip 4 (2 + 4 - 2 = 4)');
  });

  it('formatMove uses moved chip value not alignment operands', () => {
    const move: KwaMove = {
      player: 'player2',
      chip: { id: 'p2-1', value: 3, owner: 'player2', position: 'n2-2' },
      fromNode: 'n4-1',
      toNode: 'n2-2',
      alignment: {
        nodes: ['n2-0', 'n2-1', 'n2-2'],
        chips: [],
        expression: '1 + 7 - 3 = 5',
        result: 5,
      },
      moveNumber: 1,
    };
    expect(formatMove(move)).toBe('Chip 3 (1 + 7 - 3 = 5)');
  });

  it('real moveHistory entry round-trips through formatMove', () => {
    const after = moveChip(selectChip(createInitialState(), 'p1-4'), 'n1-4');
    expect(after.moveHistory).toHaveLength(1);
    expect(formatMove(after.moveHistory[0])).toMatch(/^Chip \d+$/);
  });
});
