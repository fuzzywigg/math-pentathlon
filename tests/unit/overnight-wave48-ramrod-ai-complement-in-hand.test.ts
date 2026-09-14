/**
 * Wave 48 overnight — Ramrod AI empty-box complement-in-hand bias. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove } from '../../src/games/ramrod/ai';
import type { RamrodState, Rod } from '../../src/games/ramrod/types';

afterEach(() => vi.restoreAllMocks());

function forgeComplement(): RamrodState {
  const s = createInitialState();
  const a: Rod = { id: 'a', length: 3, color: '#7cb342', owner: 'player1', position: null };
  const b: Rod = { id: 'b', length: 4, color: '#8e24aa', owner: 'player1', position: null };
  const rods = new Map(s.rods);
  rods.set(a.id, a);
  rods.set(b.id, b);
  // Clear all boxes empty
  return {
    ...s,
    rods,
    playerRods: { player1: [a.id, b.id], player2: [] },
    currentPlayer: 'player1',
    phase: 'selectingRod',
    selectedRod: null,
  };
}

describe('Wave 48 ramrod overnight — complement in hand', () => {
  it('hard random=0 places on a target that matches hand pair', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = forgeComplement();
    const move = getAIMove(state, 'player1', 'hard')!;
    const rod = state.rods.get(move.rodId)!;
    const box = state.boxes.get(move.boxId)!;
    const needed = box.targetSum - rod.length;
    expect([3, 4]).toContain(needed);
    expect(state.playerRods.player1.some((id) => state.rods.get(id)!.length === needed && id !== move.rodId)).toBe(true);
  });
});
