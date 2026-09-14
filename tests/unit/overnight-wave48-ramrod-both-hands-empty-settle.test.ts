/**
 * Wave 48 overnight — Ramrod both hands empty endgame settle. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { selectRod, placeRod, createInitialState } from '../../src/games/ramrod/rules';
import type { RamrodState, Rod, SumBox } from '../../src/games/ramrod/types';

function forgeBothEmptySettle(p1Score: number, p2Score: number): RamrodState {
  const s = createInitialState();
  const rod: Rod = {
    id: 'last-rod',
    length: 3,
    color: '#7cb342',
    owner: 'player1',
    position: null,
  };
  const partner: Rod = {
    id: 'last-partner',
    length: 4,
    color: '#8e24aa',
    owner: 'player2',
    position: { boxId: 'box-0-2', slot: 0 },
  };
  const rods = new Map<string, Rod>();
  rods.set(rod.id, rod);
  rods.set(partner.id, partner);
  // Mark all other rods as owned/positioned so draw cannot refill
  for (const [id, r] of s.rods) {
    if (id === rod.id || id === partner.id) continue;
    rods.set(id, { ...r, owner: 'player1', position: { boxId: 'box-2-0', slot: 0 } });
  }
  const boxes = new Map(s.boxes);
  const box = boxes.get('box-0-2')!;
  boxes.set(box.id, { ...box, rods: [partner, null] } as SumBox);
  return {
    ...s,
    boxes,
    rods,
    playerRods: { player1: [rod.id], player2: [] },
    scores: { player1: p1Score, player2: p2Score },
    currentPlayer: 'player1',
    phase: 'selectingRod',
    selectedRod: null,
    moveHistory: [],
  };
}

describe('Wave 48 ramrod overnight — both hands empty settle', () => {
  it('higher score wins when both hands empty after last place', () => {
    const next = placeRod(selectRod(forgeBothEmptySettle(10, 3), 'last-rod'), 'box-0-2', 1);
    expect(next.playerRods.player1).toHaveLength(0);
    expect(next.playerRods.player2).toHaveLength(0);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('equal scores yield null winner', () => {
    // capture adds targetSum 7 → start p1=0 p2=7 so after capture p1=7 p2=7
    const next = placeRod(selectRod(forgeBothEmptySettle(0, 7), 'last-rod'), 'box-0-2', 1);
    expect(next.scores.player1).toBe(next.scores.player2);
    expect(next.winner).toBeNull();
    expect(next.phase).toBe('gameOver');
  });

  it('lower score after place yields P2 winner', () => {
    const next = placeRod(selectRod(forgeBothEmptySettle(0, 20), 'last-rod'), 'box-0-2', 1);
    expect(next.winner).toBe('player2');
  });
});
