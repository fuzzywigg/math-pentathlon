/**
 * Wave 48 overnight — Ramrod TARGET_SCORE P2 settle leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { selectRod, placeRod, createInitialState } from '../../src/games/ramrod/rules';
import { CONFIG, type RamrodState, type Rod, type SumBox } from '../../src/games/ramrod/types';

function forgeP2NearWin(): RamrodState {
  const s = createInitialState();
  // box-1-3 target 9 → rods 5+4
  const rod: Rod = {
    id: 'p2-win',
    length: 5,
    color: '#fdd835',
    owner: 'player2',
    position: null,
  };
  const partner: Rod = {
    id: 'p2-partner',
    length: 4,
    color: '#8e24aa',
    owner: 'player1',
    position: { boxId: 'box-1-3', slot: 0 },
  };
  const rods = new Map(s.rods);
  rods.set(rod.id, rod);
  rods.set(partner.id, partner);
  const boxes = new Map(s.boxes);
  const box = boxes.get('box-1-3')!;
  boxes.set(box.id, { ...box, rods: [partner, null] } as SumBox);
  return {
    ...s,
    boxes,
    rods,
    playerRods: { player1: [], player2: [rod.id] },
    scores: { player1: 0, player2: CONFIG.TARGET_SCORE - box.targetSum },
    currentPlayer: 'player2',
    phase: 'selectingRod',
    selectedRod: null,
  };
}

describe('Wave 48 ramrod overnight — P2 target score win', () => {
  it('P2 completing capture reaches TARGET_SCORE', () => {
    const forged = forgeP2NearWin();
    const selected = selectRod(forged, 'p2-win');
    const next = placeRod(selected, 'box-1-3', 1);
    expect(next.winner).toBe('player2');
    expect(next.phase).toBe('gameOver');
    expect(next.scores.player2).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
  });
});
