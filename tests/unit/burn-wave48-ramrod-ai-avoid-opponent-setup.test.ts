/**
 * Wave 48 — Ramrod AI avoids setup when opponent holds needed length. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove } from '../../src/games/ramrod/ai';
import type { RamrodState, Rod, SumBox } from '../../src/games/ramrod/types';

afterEach(() => vi.restoreAllMocks());

function forgeSetupTrap(): RamrodState {
  const s = createInitialState();
  // Empty board except: placing 3 into empty box-0-2 (target 7) would need 4;
  // opponent has 4. Safer: place into empty box with complement in hand.
  const r3: Rod = { id: 'r3', length: 3, color: '#7cb342', owner: 'player1', position: null };
  const r4own: Rod = { id: 'r4o', length: 4, color: '#8e24aa', owner: 'player1', position: null };
  const opp4: Rod = { id: 'o4', length: 4, color: '#8e24aa', owner: 'player2', position: null };
  const rods = new Map(s.rods);
  for (const r of [r3, r4own, opp4]) rods.set(r.id, r);
  return {
    ...s,
    rods,
    boxes: new Map(s.boxes),
    playerRods: { player1: [r3.id, r4own.id], player2: [opp4.id] },
    scores: { player1: 0, player2: 0 },
    currentPlayer: 'player1',
    phase: 'selectingRod',
    selectedRod: null,
  };
}

describe('Wave 48 ramrod — AI avoid opponent setup', () => {
  it('hard random=0 prefers complement-in-hand over helping opponent', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const move = getAIMove(forgeSetupTrap(), 'player1', 'hard');
    expect(move).not.toBeNull();
    // Completing-path empty-box with complement scores +30; setup-trap scores -50
    // so chosen placement should be on a box where complement exists (3+4=7 → box target 7)
    expect(['r3', 'r4o']).toContain(move!.rodId);
    const boxTarget = forgeSetupTrap().boxes.get(move!.boxId)!.targetSum;
    const rodLen = move!.rodId === 'r3' ? 3 : 4;
    expect(boxTarget - rodLen).toBe(rodLen === 3 ? 4 : 3);
  });
});
