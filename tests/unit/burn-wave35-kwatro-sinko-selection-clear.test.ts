/**
 * Wave 35 — Kwatro Sinko zero-move select / format / AI null stuck.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectChip,
  clearSelection,
  getValidMoves,
  formatMove,
  hasValidMoves,
  moveChip,
} from '../../src/games/kwatro-sinko/rules';
import { getAIMove, isAITurn } from '../../src/games/kwatro-sinko/ai';

describe('Wave 35 Kwatro Sinko — selection clear', () => {
  it('opening hasValidMoves and selectChip then clearSelection', () => {
    let state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    const chip = [...state.chips.values()].find((c) => c.owner === 'player1')!;
    state = selectChip(state, chip.id);
    expect(state.selectedChip).toBe(chip.id);
    state = clearSelection(state);
    expect(state.selectedChip).toBeNull();
  });

  it('getValidMoves empty for missing chip id', () => {
    expect(getValidMoves(createInitialState(), 'no-chip')).toEqual([]);
  });

  it('moveChip identity without selection / invalid dest', () => {
    const state = createInitialState();
    expect(moveChip(state, 'nowhere')).toBe(state);
  });

  it('formatMove returns non-empty string with chip value', () => {
    const chip = { id: 'c1', value: 4, owner: 'player1' as const, position: 'n1' };
    const formatted = formatMove({
      player: 'player1',
      chip,
      fromNode: 'a',
      toNode: 'b',
      alignment: null,
      moveNumber: 1,
    });
    expect(formatted).toContain('4');
    expect(
      formatMove({
        player: 'player1',
        chip,
        fromNode: 'a',
        toNode: 'b',
        alignment: {
          nodes: ['a', 'b', 'c'],
          chips: [chip],
          expression: '2+2=4',
          result: 4,
        },
        moveNumber: 2,
      })
    ).toContain('2+2=4');
  });

  it('AI null on gameOver; hvh isAITurn false', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAIMove(over, 'player1', 'hard')).toBeNull();
    expect(isAITurn(createInitialState(), 'player1', 'human-vs-human')).toBe(false);
  });
});
