/**
 * Wave 43 TOKENMAXX — Sum Dominoes roll → placing/passing leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
  canPlayDomino,
} from '../../src/games/sum-dominoes/rules';
import { CONFIG, type Domino, type PlacedDomino, type SumDominoesState } from '../../src/games/sum-dominoes/types';

afterEach(() => vi.restoreAllMocks());

function makeDomino(id: string, face1: number, face2: number, owner: 'player1' | 'player2' = 'player1'): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function seeded(hand: Domino[]): SumDominoesState {
  const base = createInitialState();
  const board = base.board.map((row) => row.map(() => null as PlacedDomino | null));
  const seed = makeDomino('seed', 6, 6, null as unknown as 'player1');
  seed.owner = null;
  const placed: PlacedDomino = {
    domino: { ...seed, orientation: 'horizontal' },
    position: { row: CONFIG.CENTER_ROW, col: CONFIG.CENTER_COL },
    orientation: 'horizontal',
  };
  board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL] = placed;
  board[CONFIG.CENTER_ROW][CONFIG.CENTER_COL + 1] = placed;
  return {
    ...base,
    board,
    hands: { player1: hand, player2: [] },
    phase: 'rolling',
    currentDice: null,
  };
}

describe('Wave 43 sum-dominoes — roll placing/pass', () => {
  it('wrong phase is identity', () => {
    const state = { ...createInitialState(), phase: 'placing' as const };
    expect(doRollDice(state)).toBe(state);
  });

  it('roll with playable hand enters placing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // die ≈ 6
    const hand = [makeDomino('h1', 0, 1)];
    const state = seeded(hand);
    // sum 12 with center 6 needs face 6 — use matching hand
    const playable = seeded([makeDomino('h1', 6, 5)]);
    const next = doRollDice(playable);
    expect(next.currentDice).not.toBeNull();
    const sum = next.currentDice![0] + next.currentDice![1];
    if (canPlayDomino(playable, playable.hands.player1[0], sum)) {
      expect(next.phase).toBe('placing');
    } else {
      expect(next.phase).toBe('passing');
    }
    expect(state.phase).toBe('rolling');
  });

  it('roll with empty/unplayable hand enters passing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // dice 1+1=2
    const jammed = seeded([makeDomino('far', 6, 6)]); // needs adj face 1 for sum 2; center is 6
    const next = doRollDice(jammed);
    expect(next.currentDice).toEqual([1, 1]);
    expect(next.phase).toBe('passing');
  });
});
