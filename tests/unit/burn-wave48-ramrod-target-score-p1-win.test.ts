/**
 * Wave 48 leftover after #220/#221/#222 — Ramrod TARGET_SCORE P1 settle.
 * Distinct from open #224 graph/hex. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectRod,
  placeRod,
} from '../../src/games/ramrod/rules';
import { CONFIG, type RamrodState, type Rod, type SumBox } from '../../src/games/ramrod/types';

function forgeNearWin(): RamrodState {
  const s = createInitialState();
  const rod: Rod = {
    id: 'win-rod',
    length: 5,
    color: '#fdd835',
    owner: 'player1',
    position: null,
  };
  const rods = new Map(s.rods);
  rods.set(rod.id, rod);
  // Seed box-0-0 with a 0-length complement via partial rod length 0 not allowed —
  // use length 2 already in slot 0, place length 5 into target 7 box.
  const boxes = new Map(s.boxes);
  const box = boxes.get('box-0-2')!; // target 7 from createBoard row0 col2
  const partner: Rod = {
    id: 'partner',
    length: 2,
    color: '#e53935',
    owner: 'player1',
    position: { boxId: box.id, slot: 0 },
  };
  rods.set(partner.id, partner);
  const updated: SumBox = {
    ...box,
    rods: [partner, null],
  };
  boxes.set(box.id, updated);
  return {
    ...s,
    boxes,
    rods,
    playerRods: { player1: [rod.id], player2: [] },
    scores: { player1: CONFIG.TARGET_SCORE - box.targetSum, player2: 0 },
    selectedRod: null,
    phase: 'selectingRod',
    currentPlayer: 'player1',
  };
}

describe('Wave 48 ramrod — P1 target score win', () => {
  it('placeRod completing box reaches TARGET_SCORE and ends game for P1', () => {
    const forged = forgeNearWin();
    const selected = selectRod(forged, 'win-rod');
    expect(selected.phase).toBe('placingRod');
    const next = placeRod(selected, 'box-0-2', 1);
    expect(next.scores.player1).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
    expect(next.winner).toBe('player1');
    expect(next.phase).toBe('gameOver');
    expect(next.moveHistory.at(-1)?.capturedBox).toBe(true);
  });
});
