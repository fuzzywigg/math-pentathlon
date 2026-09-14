/**
 * Wave 47 leftover after #214/#215 — Kwatro-Sinko moveChip / passTurn / formatMove leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectChip,
  getValidMoves,
  moveChip,
  hasValidMoves,
  passTurn,
  formatMove,
} from '../../src/games/kwatro-sinko/rules';
import type { KwaMove } from '../../src/games/kwatro-sinko/types';

describe('Wave 47 kwatro deepen 7 — kwatro — valid move / pass / format', () => {
  it('moveChip relocates chip to a valid empty node and flips seat', () => {
    let state = createInitialState();
    const chipId = 'p1-0';
    const dest = getValidMoves(state, chipId)[0];
    expect(dest).toBeTruthy();

    state = selectChip(state, chipId);
    const from = state.chips.get(chipId)!.position!;
    state = moveChip(state, dest);

    expect(state.chips.get(chipId)!.position).toBe(dest);
    expect(state.nodes.get(from)?.chip).toBeNull();
    expect(state.nodes.get(dest)?.chip?.id).toBe(chipId);
    expect(state.selectedChip).toBeNull();
    expect(state.currentPlayer).toBe('player2');
    expect(state.phase).toBe('selectingChip');
    expect(state.moveHistory).toHaveLength(1);
    expect(state.moveHistory[0].fromNode).toBe(from);
    expect(state.moveHistory[0].toNode).toBe(dest);
  });

  it('hasValidMoves true on opening; passTurn flips player and clears selection', () => {
    let state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    state = selectChip(state, 'p1-1');
    expect(state.selectedChip).toBe('p1-1');

    state = passTurn(state);
    expect(state.currentPlayer).toBe('player2');
    expect(state.selectedChip).toBeNull();
    expect(state.phase).toBe('selectingChip');

    state = passTurn(state);
    expect(state.currentPlayer).toBe('player1');
  });

  it('formatMove includes chip value and optional alignment expression', () => {
    const chip = {
      id: 'c',
      value: 6,
      owner: 'player1' as const,
      position: 'n1-1',
    };
    const base: KwaMove = {
      player: 'player1',
      chip,
      fromNode: 'n0-0',
      toNode: 'n1-0',
      alignment: null,
      moveNumber: 1,
    };
    expect(formatMove(base)).toBe('Chip 6');
    expect(
      formatMove({
        ...base,
        alignment: {
          nodes: ['a', 'b', 'c'],
          chips: [chip],
          expression: '8 + 2 - 6 = 4',
          result: 4,
        },
      })
    ).toBe('Chip 6 (8 + 2 - 6 = 4)');
  });
});
