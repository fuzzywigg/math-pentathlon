/**
 * Wave 45 TOKENMAXX — Queens applyAIMove uses makeMove not restore. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  cellKey,
  CONFIG,
  cellsInRing,
} from '../../src/games/queens-guards/types';
import { restoreCapturedPiece } from '../../src/games/queens-guards/rules';
import { applyAIMove, getAIMove } from '../../src/games/queens-guards/ai';

describe('Wave 45 queens — applyAIMove vs restore', () => {
  it('restoreCapturedPiece clears capture; applyAIMove on restore suggestion does not', () => {
    const base = createInitialState();
    const captured = { ring: 5, position: 1 };
    const outer = CONFIG.NUM_RINGS - 1;
    let emptyPos = -1;
    for (let pos = 0; pos < cellsInRing(outer); pos++) {
      if (!base.cells.get(cellKey(outer, pos))?.piece) {
        emptyPos = pos;
        break;
      }
    }
    expect(emptyPos).toBeGreaterThanOrEqual(0);

    const withCaptured = {
      ...base,
      capturedPieces: [captured],
      cells: new Map(base.cells),
    };
    // Ensure captured cell still has a piece reference for restore
    const capCell = withCaptured.cells.get(cellKey(captured.ring, captured.position))!;
    expect(capCell.piece).not.toBeNull();

    const restored = restoreCapturedPiece(withCaptured, captured, {
      ring: outer,
      position: emptyPos,
    });
    expect(restored.capturedPieces.length).toBe(0);

    const move = getAIMove(withCaptured, 'player1', 'easy');
    expect(move).not.toBeNull();
    const applied = applyAIMove(withCaptured, move!);
    // applyAIMove → makeMove does not clear capturedPieces list the restore path does
    expect(applied.capturedPieces.length).toBe(withCaptured.capturedPieces.length);
  });
});
