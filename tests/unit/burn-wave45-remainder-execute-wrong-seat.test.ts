/**
 * Wave 45 TOKENMAXX — Remainder executeAISelection wrong-seat identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { performRoll } from '../../src/games/remainder-islands/rules';
import { executeAISelection } from '../../src/games/remainder-islands/ai';

describe('Wave 45 remainder — execute wrong seat', () => {
  it('wrong seat returns identity even in selectIsland', () => {
    let state = createInitialState();
    // force a selectIsland phase
    for (let i = 0; i < 20 && state.phase === 'rolling'; i++) {
      state = performRoll(state);
      if (state.phase === 'selectIsland') break;
      // skipped → still rolling with flipped seat; keep rolling
    }
    if (state.phase !== 'selectIsland') {
      state = {
        ...createInitialState(),
        phase: 'selectIsland',
        currentRoll: { die1: 3, die2: 4, total: 7 },
        validIslands: createInitialState().islands.slice(0, 3).map((i) => i.id),
      };
    }
    const wrong = state.currentPlayer === 'player1' ? 'player2' : 'player1';
    expect(executeAISelection(state, wrong, 'hard')).toBe(state);
  });
});
