/**
 * Wave 44 overnight HEAVY — Fab executeAITurn passes when no move.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { executeAITurn } from '../../src/games/fab-a-diffy/ai';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 fab AI — execute null pass', () => {
  it('jammed board passes and may settle', () => {
    const s = createInitialState();
    const bars = new Map(s.fractionBars);
    for (const [id, b] of bars) bars.set(id, { ...b, used: true });
    const jammed: FabADiffyState = { ...s, fractionBars: bars, scores: { player1: 1, player2: 0 } };
    const next = executeAITurn(jammed, 'player1', 'hard');
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
