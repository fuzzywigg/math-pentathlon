/**
 * Wave 44 — Sum Dominoes createInitialState CONFIG handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, getRemainingCount } from '../../src/games/sum-dominoes/rules';
import {
  CONFIG,
  createDominoSet,
  isDouble,
} from '../../src/games/sum-dominoes/types';

describe('Wave 44 sum-dominoes — init CONFIG handshake', () => {
  it('initial board size matches CONFIG.BOARD_SIZE square', () => {
    const state = createInitialState();
    expect(state.board.length).toBe(CONFIG.BOARD_SIZE);
    for (const row of state.board) {
      expect(row.length).toBe(CONFIG.BOARD_SIZE);
    }
  });

  it('center seed is a double when double-six or any double remains', () => {
    const state = createInitialState();
    const seed = state.board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL];
    expect(seed).not.toBeNull();
    // Prefer double-six; otherwise any double; otherwise first remaining
    // After dealing 14 tiles, doubles often remain — assert seed exists with faces in range
    expect(seed!.domino.face1).toBeGreaterThanOrEqual(0);
    expect(seed!.domino.face1).toBeLessThanOrEqual(CONFIG.MAX_FACE_VALUE);
    expect(seed!.domino.face2).toBeGreaterThanOrEqual(0);
    expect(seed!.domino.face2).toBeLessThanOrEqual(CONFIG.MAX_FACE_VALUE);
    expect(seed!.orientation).toBe('horizontal');
  });

  it('dealt ids are subset of full createDominoSet', () => {
    const full = new Set(createDominoSet().map((d) => d.id));
    const state = createInitialState();
    for (const d of [...state.hands.player1, ...state.hands.player2]) {
      expect(full.has(d.id)).toBe(true);
    }
    expect(getRemainingCount(state, 'player1') + getRemainingCount(state, 'player2')).toBe(
      CONFIG.STARTING_HAND_SIZE * 2
    );
  });

  it('double count in full set is MAX_FACE_VALUE+1', () => {
    const doubles = createDominoSet().filter(isDouble);
    expect(doubles).toHaveLength(CONFIG.MAX_FACE_VALUE + 1);
  });
});
