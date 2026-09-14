/**
 * Wave 45 TOKENMAXX — cross-engine AI null on wrong seat. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState as kingsOpen } from '../../src/games/kings-quadraphages/game-state';
import { getAIMove as kingsAI } from '../../src/games/kings-quadraphages/ai';
import { createInitialState as queensOpen } from '../../src/games/queens-guards/types';
import { getAIMove as queensAI } from '../../src/games/queens-guards/ai';
import { createInitialState as parOpen } from '../../src/games/par-55/rules';
import { getAIMove as parAI } from '../../src/games/par-55/ai';
import { createInitialState as kwaOpen } from '../../src/games/kwatro-sinko/rules';
import { getAIMove as kwaAI } from '../../src/games/kwatro-sinko/ai';

describe('Wave 45 handshake — AI wrong-seat nulls', () => {
  it('seat-gated engines null for player2; kings still proposes for p2 king', () => {
    // Kings AI is seat-agnostic (plans for requested player even if not current)
    expect(kingsAI(kingsOpen(), 'player2', 'easy')).not.toBeNull();
    expect(queensAI(queensOpen(), 'player2', 'easy')).toBeNull();
    expect(parAI(parOpen(), 'player2', 'easy')).toBeNull();
    expect(kwaAI(kwaOpen(), 'player2', 'easy')).toBeNull();
  });
});
