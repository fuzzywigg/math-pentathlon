/**
 * Overnight HEAVY — executeAITurn passes when all expression cells owned.
 * Distinct leftover vs wave42 execute happy path. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { executeAITurn } from '../../src/games/prime-gold/ai';
import {
  createInitialState,
  getValidPlacements,
} from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight prime — execute pass empty', () => {
  it('rolls then passes when no empty expression targets remain', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    // Pre-claim every cell so any roll has zero placements
    const cells = new Map(state.cells);
    for (const [k, cell] of cells) {
      cells.set(k, { ...cell, owner: 'player2' });
    }
    state = { ...state, cells };
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.phase).toBe('rolling'); // passTurn flips seat + rolling
    expect(next.currentPlayer).toBe('player2');
    expect(getValidPlacements({ ...next, phase: 'placing', diceRoll: next.diceRoll })).toEqual([]);
  });
});
