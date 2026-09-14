/**
 * Wave 48 — Ramrod executeAITurn passes when hand empty. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { executeAITurn } from '../../src/games/ramrod/ai';
import type { RamrodState } from '../../src/games/ramrod/types';

describe('Wave 48 ramrod — executeAITurn pass empty', () => {
  it('empty hand passes and flips seat', () => {
    const s = createInitialState();
    const forged: RamrodState = {
      ...s,
      playerRods: { player1: [], player2: s.playerRods.player2 },
      currentPlayer: 'player1',
      phase: 'selectingRod',
      selectedRod: null,
    };
    const next = executeAITurn(forged, 'player1', 'medium');
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedRod).toBeNull();
    expect(next.phase).toBe('selectingRod');
  });
});
