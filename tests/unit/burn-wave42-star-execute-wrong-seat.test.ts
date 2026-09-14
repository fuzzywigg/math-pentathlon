/**
 * Wave 42 — Star Track executeAITurn wrong seat identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { executeAITurn, isAITurn } from '../../src/games/star-track/ai';
import { createInitialState } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';

describe('Wave 42 star-track — wrong seat', () => {
  it('executeAITurn for player2 on p1 turn leaves draw phase or no progress for p2', () => {
    const open = createInitialState();
    expect(isAITurn(open, 'player2', 'human-vs-ai')).toBe(false);
    const next = executeAITurn(open, 'player2', 'medium');
    expect(next.player2Position).toBe(0);
  });

  it('after draw, wrong seat AI choice null path via execute', () => {
    const drawn = drawChains(createInitialState());
    const next = executeAITurn(drawn, 'player2', 'hard');
    expect(next.phase).toBe('selectChain');
    expect(next.player2Position).toBe(0);
  });
});
