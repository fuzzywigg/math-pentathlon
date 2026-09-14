/**
 * Wave 47 leftover after #214/#215 — Kwatro-Sinko passTurn / formatMove / gameOver AI-null edges. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  passTurn,
  formatMove,
  selectChip,
  moveChip,
} from '../../src/games/kwatro-sinko/rules';
import { getAIMove } from '../../src/games/kwatro-sinko/ai';
import type { Chip, KwaMove, KwaState } from '../../src/games/kwatro-sinko/types';

describe('Wave 47 kwatro deepen 3 — kwatro-sinko — pass format gameOver', () => {
  it('passTurn flips player and clears selection', () => {
    const state = createInitialState();
    const selected = selectChip(state, 'p1-0');
    const next = passTurn(selected);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedChip).toBeNull();
    expect(next.phase).toBe('selectingChip');
  });

  it('formatMove includes chip value and optional alignment', () => {
    const chip: Chip = {
      id: 'c',
      value: 8,
      owner: 'player1',
      position: 'n1-1',
    };
    const base: KwaMove = {
      player: 'player1',
      chip,
      fromNode: 'n0-0',
      toNode: 'n1-1',
      alignment: null,
      moveNumber: 1,
    };
    expect(formatMove(base)).toBe('Chip 8');
    expect(
      formatMove({
        ...base,
        alignment: {
          nodes: ['a', 'b', 'c'],
          chips: [chip],
          expression: '8 + 1 - 4 = 5',
          result: 5,
        },
      })
    ).toBe('Chip 8 (8 + 1 - 4 = 5)');
  });

  it('gameOver select/move identity; AI move null', () => {
    const over: KwaState = {
      ...createInitialState(),
      phase: 'gameOver',
      winner: 'player1',
      selectedChip: null,
    };
    expect(selectChip(over, 'p1-0')).toBe(over);
    expect(moveChip(over, 'n1-0')).toBe(over);
    expect(getAIMove(over, 'player1', 'hard')).toBeNull();
    expect(getAIMove(over, 'player2', 'easy')).toBeNull();
  });
});
