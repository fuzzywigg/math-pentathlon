/**
 * Wave 41 — Par 55 passTurn / hasValidMoves / format / attr leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  passTurn,
  hasValidMoves,
  getValidPlacements,
  formatMove,
  getAttributeDisplayName,
} from '../../src/games/par-55/rules';
import type { Par55State } from '../../src/games/par-55/types';

describe('Wave 41 par — pass / moves / format / attr', () => {
  it('passTurn flips seat, clears selection, restores selectingBlock', () => {
    let state = createInitialState();
    state = selectBlock(state, state.hands.player1[0].id);
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedBlock).toBeNull();
    expect(next.phase).toBe('selectingBlock');
  });

  it('hasValidMoves true at open; false with empty hand or no placements', () => {
    const open = createInitialState();
    expect(hasValidMoves(open)).toBe(true);
    expect(getValidPlacements(open).length).toBeGreaterThan(0);

    const emptyHand: Par55State = {
      ...open,
      hands: { ...open.hands, player1: [] },
    };
    expect(hasValidMoves(emptyHand)).toBe(false);

    // Clear all blocks → no adjacency seeds → no placements
    const bases = new Map(open.bases);
    for (const [id, base] of bases) {
      bases.set(id, { ...base, block: null, placedBy: null });
    }
    const barren: Par55State = { ...open, bases };
    expect(getValidPlacements(barren)).toEqual([]);
    expect(hasValidMoves(barren)).toBe(false);
  });

  it('getAttributeDisplayName maps known attrs; falls back otherwise', () => {
    expect(getAttributeDisplayName('shape')).toBe('Shape');
    expect(getAttributeDisplayName('color')).toBe('Color');
    expect(getAttributeDisplayName('size')).toBe('Size');
    expect(getAttributeDisplayName('thickness')).toBe('Thickness');
    expect(getAttributeDisplayName('mystery')).toBe('mystery');
  });

  it('formatMove includes attributes and pts', () => {
    const block = createInitialState().hands.player1[0];
    const formatted = formatMove({
      player: 'player1',
      block,
      baseId: 'base-0-0',
      pointsScored: 3,
      matchDetails: [],
      moveNumber: 1,
    });
    expect(formatted).toContain(block.size);
    expect(formatted).toContain(block.color);
    expect(formatted).toContain(block.shape);
    expect(formatted).toContain('3 pts');
  });
});
