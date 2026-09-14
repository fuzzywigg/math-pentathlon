/**
 * Wave 48 — Ramrod hard AI prefers winning complete (random=0). Tests-only.
 * Avoids hard-AI Math.random spy OOM (#213): single mockReturnValue.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove } from '../../src/games/ramrod/ai';
import { CONFIG, type RamrodState, type Rod, type SumBox } from '../../src/games/ramrod/types';

afterEach(() => vi.restoreAllMocks());

function forgeWinningAvailable(): RamrodState {
  const s = createInitialState();
  const winRod: Rod = {
    id: 'win',
    length: 5,
    color: '#fdd835',
    owner: 'player1',
    position: null,
  };
  const decoy: Rod = {
    id: 'decoy',
    length: 1,
    color: '#ffffff',
    owner: 'player1',
    position: null,
  };
  const partner: Rod = {
    id: 'part',
    length: 2,
    color: '#e53935',
    owner: 'player2',
    position: { boxId: 'box-0-2', slot: 0 },
  };
  const rods = new Map(s.rods);
  rods.set(winRod.id, winRod);
  rods.set(decoy.id, decoy);
  rods.set(partner.id, partner);
  const boxes = new Map(s.boxes);
  boxes.set('box-0-2', { ...boxes.get('box-0-2')!, rods: [partner, null] } as SumBox);
  return {
    ...s,
    boxes,
    rods,
    playerRods: { player1: [winRod.id, decoy.id], player2: [] },
    scores: { player1: CONFIG.TARGET_SCORE - 7, player2: 0 },
    currentPlayer: 'player1',
    phase: 'selectingRod',
    selectedRod: null,
  };
}

describe('Wave 48 ramrod — AI winning complete prefer', () => {
  it('hard with random=0 picks completing rod that wins', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const move = getAIMove(forgeWinningAvailable(), 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.rodId).toBe('win');
    expect(move!.boxId).toBe('box-0-2');
  });
});
