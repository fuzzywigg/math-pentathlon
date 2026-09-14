/**
 * Wave 45 — Contig placeChip moveNumber continues from non-empty history
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 45 Contig — history second moveNumber', () => {
  it('appends moveNumber = history.length + 1', () => {
    const prior = {
      player: 'player1' as const,
      dice: [1, 1, 1] as [number, number, number],
      expression: '1+1+1',
      result: 3,
      points: 0,
      moveNumber: 1,
    };
    const state: ContigState = {
      ...createInitialState(),
      phase: 'calculating',
      currentDice: [2, 2, 2],
      currentPlayer: 'player2',
      moveHistory: [prior],
    };
    const next = placeChip(state, 6, '(2+2)+2');
    expect(next.moveHistory).toHaveLength(2);
    expect(next.moveHistory[1].moveNumber).toBe(2);
    expect(next.moveHistory[1].player).toBe('player2');
  });
});
