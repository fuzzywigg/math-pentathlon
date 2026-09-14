/**
 * Wave 42 — Star Track AI execute across difficulties (leftover). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAIChainChoice,
  executeAITurn,
  isAITurn,
} from '../../src/games/star-track/ai';
import { createInitialState } from '../../src/games/star-track/types';
import { drawChains, selectChain } from '../../src/games/star-track/rules';

describe('Wave 42 star-track — AI execute', () => {
  it('after draw, AI chooses 0 or 1', () => {
    let s = drawChains(createInitialState());
    expect(s.phase).toBe('selectChain');
    for (const d of ['easy', 'medium', 'hard'] as const) {
      const choice = getAIChainChoice(s, 'player1', d);
      expect(choice).not.toBeNull();
      expect([0, 1]).toContain(choice!.chainIndex);
    }
  });

  it('executeAITurn from drawChains advances position', () => {
    const open = createInitialState();
    expect(isAITurn(open, 'player1', 'human-vs-ai')).toBe(true);
    const next = executeAITurn(open, 'player1', 'hard');
    expect(next.player1Position).toBeGreaterThan(0);
    expect(next.currentPlayer === 'player2' || next.phase === 'gameOver').toBe(true);
  });

  it('wrong seat null; selectChain wrong phase identity', () => {
    const open = createInitialState();
    expect(getAIChainChoice(open, 'player1', 'medium')).toBeNull();
    expect(selectChain(open, 0)).toBe(open);
    const drawn = drawChains(open);
    expect(getAIChainChoice(drawn, 'player2', 'medium')).toBeNull();
  });
});
