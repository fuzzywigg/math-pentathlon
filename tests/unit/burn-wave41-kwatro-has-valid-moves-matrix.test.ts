/**
 * Wave 41 — Kwatro-Sinko hasValidMoves / zero-move select matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  hasValidMoves,
  getValidMoves,
  selectChip,
  passTurn,
} from '../../src/games/kwatro-sinko/rules';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';

describe('Wave 41 kwatro-sinko — hasValidMoves matrix', () => {
  it('opening player1 has valid moves', () => {
    const state = createInitialState();
    expect(hasValidMoves(state)).toBe(true);
    const own = [...state.chips.values()].filter((c) => c.owner === 'player1');
    expect(own.some((c) => getValidMoves(state, c.id).length > 0)).toBe(true);
  });

  it('false when current player chips are fully blocked', () => {
    const state = createInitialState();
    const nodes = new Map(state.nodes);
    const chips = new Map(state.chips);
    let n = 0;
    for (const [id, node] of nodes) {
      if (!node.chip) {
        const chip: Chip = {
          id: `fill-${n++}`,
          value: 1,
          owner: 'player2',
          position: id,
        };
        chips.set(chip.id, chip);
        nodes.set(id, { ...node, chip });
      }
    }
    const blocked: KwaState = { ...state, nodes, chips };
    expect(hasValidMoves(blocked)).toBe(false);
    expect(selectChip(blocked, 'p1-0')).toBe(blocked);
  });

  it('passTurn after blocked state still flips seat', () => {
    const state = createInitialState();
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(hasValidMoves(next)).toBe(true);
  });

  it('player2 opening after pass sees own chip moves', () => {
    const p2 = passTurn(createInitialState());
    expect(p2.currentPlayer).toBe('player2');
    const chipId = 'p2-0';
    const moves = getValidMoves(p2, chipId);
    expect(moves.length).toBeGreaterThan(0);
    const selected = selectChip(p2, chipId);
    expect(selected.selectedChip).toBe(chipId);
    expect(selectChip(p2, 'p1-0')).toBe(p2);
  });
});
