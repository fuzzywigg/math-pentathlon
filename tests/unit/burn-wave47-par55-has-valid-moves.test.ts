/**
 * Wave 47 leftover after #214/#215 — Par 55 hasValidMoves edge leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  hasValidMoves,
  getValidPlacements,
} from '../../src/games/par-55/rules';
import { createBaseId, type Par55State } from '../../src/games/par-55/types';

describe('Wave 47 par deepen 9 — Wave 47 par55 — hasValidMoves edges', () => {
  it('false when current player hand is empty even with placements', () => {
    const open = createInitialState();
    expect(getValidPlacements(open).length).toBeGreaterThan(0);
    const emptyHand: Par55State = {
      ...open,
      hands: { ...open.hands, player1: [] },
    };
    expect(hasValidMoves(emptyHand)).toBe(false);
  });

  it('false when no adjacent empty bases despite non-empty hand', () => {
    const open = createInitialState();
    const bases = new Map(open.bases);
    for (const [id, base] of bases) {
      bases.set(id, { ...base, block: null, placedBy: null });
    }
    const barren: Par55State = { ...open, bases };
    expect(getValidPlacements(barren)).toEqual([]);
    expect(hasValidMoves(barren)).toBe(false);
  });

  it('true when forged seed creates adjacency and hand has blocks', () => {
    const open = createInitialState();
    const bases = new Map(open.bases);
    for (const [id, base] of bases) {
      bases.set(id, { ...base, block: null, placedBy: null });
    }
    const seedId = createBaseId(2, 3);
    const seedBlock = open.hands.player1[0];
    bases.set(seedId, {
      ...bases.get(seedId)!,
      block: seedBlock,
      placedBy: null,
    });
    const seeded: Par55State = { ...open, bases };
    expect(getValidPlacements(seeded).length).toBeGreaterThan(0);
    expect(hasValidMoves(seeded)).toBe(true);
  });

  it('respects currentPlayer seat for hand check', () => {
    const open = createInitialState();
    const p2Empty: Par55State = {
      ...open,
      currentPlayer: 'player2',
      hands: { ...open.hands, player2: [] },
    };
    expect(hasValidMoves(p2Empty)).toBe(false);

    const p1Empty: Par55State = {
      ...open,
      currentPlayer: 'player1',
      hands: { ...open.hands, player1: [] },
    };
    expect(hasValidMoves(p1Empty)).toBe(false);
  });
});
