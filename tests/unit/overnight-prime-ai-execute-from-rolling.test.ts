/**
 * Overnight TOKENMAXX HEAVY — prime-gold executeAITurn from rolling leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { executeAITurn, isAITurn } from '../../src/games/prime-gold/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight prime — executeAITurn from rolling', () => {
  it('executeAITurn advances from rolling and isAITurn gates', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const open = createInitialState();
    expect(isAITurn(open, 'player1', 'human-vs-ai')).toBe(true);
    const next = executeAITurn(open, 'player1', 'hard');
    // Either placed (seat flipped or win) or still on board after pass
    expect(next).not.toBe(open);
    expect(['rolling', 'placing', 'gameOver']).toContain(next.phase);
  });
});
