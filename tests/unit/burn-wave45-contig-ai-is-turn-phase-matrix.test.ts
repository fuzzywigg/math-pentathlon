/**
 * Wave 45 — Contig isAITurn phase/seat/mode matrix
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { isAITurn } from '../../src/games/contig-60/ai';

describe('Wave 45 Contig AI — isAITurn matrix', () => {
  it('true for AI seat in rolling and calculating; false elsewhere', () => {
    const base = createInitialState();
    expect(isAITurn(base, 'player1', 'human-vs-ai')).toBe(true);
    expect(
      isAITurn({ ...base, phase: 'calculating', currentDice: [1, 2, 3] }, 'player1', 'human-vs-ai')
    ).toBe(true);
    expect(isAITurn(base, 'player1', 'human-vs-human')).toBe(false);
    expect(isAITurn({ ...base, phase: 'gameOver', winner: 'player1' }, 'player1', 'human-vs-ai')).toBe(
      false
    );
    expect(isAITurn(base, null, 'human-vs-ai')).toBe(false);
  });
});
