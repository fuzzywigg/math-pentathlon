/**
 * Wave 48 overnight — Ramrod AI high-value (≥9) capture prefer. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove } from '../../src/games/ramrod/ai';
import type { RamrodState, Rod, SumBox } from '../../src/games/ramrod/types';

afterEach(() => vi.restoreAllMocks());

function forgeTwoCompletes(): RamrodState {
  const s = createInitialState();
  const hi: Rod = { id: 'hi', length: 5, color: '#fdd835', owner: 'player1', position: null };
  const lo: Rod = { id: 'lo', length: 2, color: '#e53935', owner: 'player1', position: null };
  const pHi: Rod = { id: 'phi', length: 5, color: '#fdd835', owner: 'player2', position: { boxId: 'box-2-3', slot: 0 } };
  const pLo: Rod = { id: 'plo', length: 3, color: '#7cb342', owner: 'player2', position: { boxId: 'box-0-0', slot: 0 } };
  const rods = new Map(s.rods);
  for (const r of [hi, lo, pHi, pLo]) rods.set(r.id, r);
  const boxes = new Map(s.boxes);
  // box-2-3 target 10; box-0-0 target 5
  boxes.set('box-2-3', { ...boxes.get('box-2-3')!, rods: [pHi, null] } as SumBox);
  boxes.set('box-0-0', { ...boxes.get('box-0-0')!, rods: [pLo, null] } as SumBox);
  return {
    ...s,
    boxes,
    rods,
    playerRods: { player1: [hi.id, lo.id], player2: [] },
    scores: { player1: 0, player2: 0 },
    currentPlayer: 'player1',
    phase: 'selectingRod',
    selectedRod: null,
  };
}

describe('Wave 48 ramrod overnight — high value capture', () => {
  it('hard random=0 prefers completing target≥9 over low box', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const move = getAIMove(forgeTwoCompletes(), 'player1', 'hard');
    expect(move!.rodId).toBe('hi');
    expect(move!.boxId).toBe('box-2-3');
  });
});
