/**
 * Wave 45 — Contig executeAITurn identity when wrong seat on rolling
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { executeAITurn } from '../../src/games/contig-60/ai';

describe('Wave 45 Contig AI — wrong seat rolling identity', () => {
  it('leaves state unchanged when AI seat is not current player', () => {
    const state = createInitialState(); // p1 rolling
    const next = executeAITurn(state, 'player2', 'hard');
    expect(next).toEqual(state);
    expect(next.phase).toBe('rolling');
    expect(next.moveHistory).toHaveLength(0);
  });
});
