/**
 * Wave 43 — Juggle AI auto-monomino path places and flips seat. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { executeAITurn } from '../../src/games/juggle/ai';

describe('Wave 43 juggle — AI monomino place path', () => {
  it('from selectingShape with die1 monomino, AI places and seat flips', () => {
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 1] as [number, number],
    };
    expect(selectDie(selecting, 0).phase).toBe('placing');
    const next = executeAITurn(selecting, 'player1', 'easy');
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory.length).toBe(1);
  });
});
