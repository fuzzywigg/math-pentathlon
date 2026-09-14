/**
 * Wave 48 overnight — Ramrod no draw when pool exhausted. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { selectRod, placeRod, createInitialState } from '../../src/games/ramrod/rules';
import type { RamrodState, Rod, SumBox } from '../../src/games/ramrod/types';

function forgePoolEmpty(): RamrodState {
  const s = createInitialState();
  const rod: Rod = {
    id: 'only',
    length: 3,
    color: '#7cb342',
    owner: 'player1',
    position: null,
  };
  const partner: Rod = {
    id: 'part',
    length: 4,
    color: '#8e24aa',
    owner: 'player2',
    position: { boxId: 'box-0-2', slot: 0 },
  };
  const rods = new Map<string, Rod>();
  rods.set(rod.id, rod);
  rods.set(partner.id, partner);
  for (const [id, r] of s.rods) {
    if (id === rod.id || id === partner.id) continue;
    rods.set(id, { ...r, owner: 'player2', position: { boxId: 'box-2-3', slot: 1 } });
  }
  const boxes = new Map(s.boxes);
  boxes.set('box-0-2', { ...boxes.get('box-0-2')!, rods: [partner, null] } as SumBox);
  return {
    ...s,
    boxes,
    rods,
    playerRods: { player1: [rod.id], player2: ['ghost'] },
    scores: { player1: 0, player2: 0 },
    currentPlayer: 'player1',
    phase: 'selectingRod',
    selectedRod: null,
  };
}

describe('Wave 48 ramrod overnight — no draw when pool empty', () => {
  it('hand shrinks by one when no unused rods remain', () => {
    const forged = forgePoolEmpty();
    // keep a ghost id so both-hands-empty settle does not fire (P2 still "has" rods)
    const next = placeRod(selectRod(forged, 'only'), 'box-0-2', 1);
    expect(next.playerRods.player1).toHaveLength(0);
    expect(next.phase).not.toBe('gameOver');
  });
});
