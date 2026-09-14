/**
 * Overnight HEAVY after #210 — Queens AI restore choice applied via rules restore.
 * #210 covered full-outer null; applyAIMove uses makeMove (not restore path).
 * Tests-only — locks AI×rules handshake without inventing product.
 */
import { describe, it, expect } from 'vitest';
import { getAIMove } from '../../src/games/queens-guards/ai';
import { restoreCapturedPiece } from '../../src/games/queens-guards/rules';
import {
  createInitialState,
  cellKey,
  CONFIG,
  type QueensGuardsState,
} from '../../src/games/queens-guards/types';

describe('Overnight queens — AI restore via rules', () => {
  it('getAIMove restore slot works with restoreCapturedPiece', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const [key, cell] of cells) {
      cells.set(key, { ...cell, piece: null });
    }
    const captured = { ring: 3, position: 0 };
    // Captured piece still sits on board until restore (rules contract)
    cells.set(cellKey(captured.ring, captured.position), {
      ...cells.get(cellKey(captured.ring, captured.position))!,
      piece: { id: 'cap-g', player: 'player2', type: 'guard' },
    });
    const state: QueensGuardsState = {
      ...base,
      cells,
      currentPlayer: 'player1',
      capturedPieces: [captured],
      winner: null,
      moveHistory: [],
    };

    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(move!.from).toEqual(captured);
    expect(move!.to.ring).toBe(CONFIG.NUM_RINGS - 1);

    const next = restoreCapturedPiece(state, move!.from, move!.to);
    expect(next.capturedPieces).toHaveLength(0);
    expect(
      next.cells.get(cellKey(move!.to.ring, move!.to.position))?.piece?.id
    ).toBe('cap-g');
    expect(
      next.cells.get(cellKey(captured.ring, captured.position))?.piece
    ).toBeNull();
  });
});
