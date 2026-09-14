/**
 * Overnight TOKENMAXX HEAVY — queens-guards applyAIMove restore-shaped noop leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { getAIMove, applyAIMove } from '../../src/games/queens-guards/ai';
import { restoreCapturedPiece } from '../../src/games/queens-guards/rules';
import { createInitialState, cellKey, type QueensGuardsState } from '../../src/games/queens-guards/types';

describe('Overnight queens — applyAIMove restore-shaped is noop', () => {
  function withCaptured(): QueensGuardsState {
    const state = createInitialState();
    const captured = { ring: 2, position: 0 };
    const cells = new Map(state.cells);
    cells.set(cellKey(captured.ring, captured.position), {
      ...cells.get(cellKey(captured.ring, captured.position))!,
      piece: { id: 'cap', player: 'player1', type: 'guard' },
    });
    return { ...state, cells, capturedPieces: [captured] };
  }

  it('applyAIMove leaves state identity when move is restore-shaped', () => {
    const state = withCaptured();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.from).toEqual({ ring: 2, position: 0 });
    expect(move!.to.ring).toBe(5);
    const applied = applyAIMove(state, move!);
    expect(applied).toBe(state);
    expect(applied.capturedPieces).toHaveLength(1);
  });

  it('restoreCapturedPiece with same coords actually restores', () => {
    const state = withCaptured();
    const move = getAIMove(state, 'player1', 'hard')!;
    const restored = restoreCapturedPiece(state, move.from, move.to);
    expect(restored).not.toBe(state);
    expect(restored.capturedPieces).toHaveLength(0);
    expect(restored.cells.get(cellKey(move.to.ring, move.to.position))?.piece?.id).toBe('cap');
  });
});
