/**
 * Wave 42 leftovers B — Remainder AI on performRoll-seeded state matrix.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { performRoll } from '../../src/games/remainder-islands/rules';
import {
  getAIIslandChoice,
  executeAISelection,
  isAITurn,
} from '../../src/games/remainder-islands/ai';
import { createInitialState } from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — AI after performRoll', () => {
  it('when selectIsland, AI chooses and execute advances seat', () => {
    let advanced = false;
    for (let i = 0; i < 20 && !advanced; i++) {
      const rolled = performRoll(createInitialState());
      if (rolled.phase !== 'selectIsland') continue;
      expect(isAITurn(rolled, 'player1')).toBe(true);
      const choice = getAIIslandChoice(rolled, 'player1', 'hard');
      expect(choice).not.toBeNull();
      const next = executeAISelection(rolled, 'player1', 'hard');
      expect(next.currentPlayer).toBe('player2');
      expect(next.phase === 'rolling' || next.phase === 'gameOver').toBe(true);
      advanced = true;
    }
    expect(advanced).toBe(true);
  });
});
