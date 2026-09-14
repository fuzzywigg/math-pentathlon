/**
 * Wave 44 — Fab-a-Diffy isAITurn mid-phase leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { isAITurn } from '../../src/games/fab-a-diffy/ai';
import type { FabADiffyState, GamePhase } from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab AI — isAITurn mid phases', () => {
  const livePhases: GamePhase[] = [
    'selectingBar1',
    'selectingBar2',
    'selectingOperation',
    'confirmingMove',
  ];

  it.each(livePhases)('true for AI seat during %s', (phase) => {
    const state = createInitialState();
    const mid: FabADiffyState = { ...state, phase, currentPlayer: 'player2' };
    expect(isAITurn(mid, 'player2', 'human-vs-ai')).toBe(true);
    expect(isAITurn(mid, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('false when human-vs-human even if seat matches', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-human')).toBe(false);
  });

  it('false for null aiPlayer across phases', () => {
    const state = createInitialState();
    expect(isAITurn({ ...state, phase: 'confirmingMove' }, null, 'human-vs-ai')).toBe(
      false
    );
  });
});
