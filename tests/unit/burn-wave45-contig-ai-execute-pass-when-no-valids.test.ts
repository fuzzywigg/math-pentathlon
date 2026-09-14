/**
 * Wave 45 — Contig executeAITurn pass from calculating with no valids
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { executeAITurn } from '../../src/games/contig-60/ai';

describe('Wave 45 Contig AI — execute pass no valids', () => {
  it('passes and increments consecutivePasses when dice miss the board', () => {
    const cells = new Map(createInitialState().cells);
    for (const [v, cell] of cells) cells.set(v, { ...cell, owner: 'player2' });
    const state: ContigState = {
      ...createInitialState(),
      cells,
      phase: 'calculating',
      currentDice: [1, 1, 1],
      currentPlayer: 'player1',
    };
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.consecutivePasses.player1).toBe(1);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
  });
});
