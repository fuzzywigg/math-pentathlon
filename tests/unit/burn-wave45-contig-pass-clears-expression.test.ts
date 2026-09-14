/**
 * Wave 45 — Contig passTurn clears currentExpression
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { passTurn } from '../../src/games/contig-60/rules';

describe('Wave 45 Contig — pass clears expression', () => {
  it('nulls currentExpression on mid-threshold pass', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
      currentExpression: '(1 + 2) * 3',
      consecutivePasses: { player1: 1, player2: 0 },
    };
    const next = passTurn(state);
    expect(next.currentExpression).toBeNull();
    expect(next.currentDice).toBeNull();
    expect(next.phase).toBe('rolling');
    expect(next.consecutivePasses.player1).toBe(2);
  });
});
