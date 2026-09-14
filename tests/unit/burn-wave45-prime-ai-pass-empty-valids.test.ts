/**
 * Wave 45 — Prime Gold executeAITurn pass when no valids leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { executeAITurn } from '../../src/games/prime-gold/ai';

describe('Wave 45 prime — AI pass empty', () => {
  it('placing with all cells owned → passTurn', () => {
    let state = createInitialState();
    const cells = new Map(state.cells);
    for (const [k, c] of cells) cells.set(k, { ...c, owner: 'player2' });
    state = { ...state, cells, phase: 'placing', diceRoll: { die1: 1, die2: 1, die3: 1 } };
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.moveHistory).toHaveLength(0);
  });
});
