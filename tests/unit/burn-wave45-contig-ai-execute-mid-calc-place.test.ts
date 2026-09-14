/**
 * Wave 45 — Contig executeAITurn places from calculating without re-roll
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { executeAITurn } from '../../src/games/contig-60/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 Contig AI — execute mid-calc place', () => {
  it('places from calculating and flips seat without changing dice path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state: ContigState = {
      ...createInitialState(),
      phase: 'calculating',
      currentDice: [2, 3, 4],
      currentPlayer: 'player1',
    };
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.moveHistory.length).toBe(1);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.currentDice).toBeNull();
  });
});
