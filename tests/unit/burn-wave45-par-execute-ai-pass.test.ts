/**
 * Wave 45 TOKENMAXX — Par-55 executeAITurn pass when no moves. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { executeAITurn } from '../../src/games/par-55/ai';

describe('Wave 45 par55 — execute pass path', () => {
  it('empty hand forces pass via executeAITurn', () => {
    const open = createInitialState();
    const empty = {
      ...open,
      hands: { ...open.hands, player1: [] },
    };
    const next = executeAITurn(empty, 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
  });
});
