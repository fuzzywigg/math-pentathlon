/**
 * Overnight TOKENMAXX HEAVY — queens-guards handshake restore vs apply leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { getAIMove, applyAIMove } from '../../src/games/queens-guards/ai';
import { restoreCapturedPiece, makeMove } from '../../src/games/queens-guards/rules';
import { createInitialState, cellKey } from '../../src/games/queens-guards/types';

describe('Overnight queens — handshake restore vs apply', () => {
  it('makeMove rejects restore-shaped coords same as applyAIMove', () => {
    const state = createInitialState();
    const captured = { ring: 3, position: 2 };
    const cells = new Map(state.cells);
    cells.set(cellKey(captured.ring, captured.position), {
      ...cells.get(cellKey(captured.ring, captured.position))!,
      piece: { id: 'c', player: 'player1', type: 'guard' },
    });
    const withCap = { ...state, cells, capturedPieces: [captured] };
    const move = getAIMove(withCap, 'player1', 'medium')!;
    expect(makeMove(withCap, move.from, move.to)).toBe(withCap);
    expect(applyAIMove(withCap, move)).toBe(withCap);
    expect(restoreCapturedPiece(withCap, move.from, move.to).capturedPieces.length).toBe(0);
  });
});
