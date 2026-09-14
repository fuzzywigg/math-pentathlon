/**
 * Wave 43 — Juggle executeAITurn does not roll from rolling phase. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { executeAITurn } from '../../src/games/juggle/ai';

describe('Wave 43 juggle — executeAITurn rolling', () => {
  it('leaves rolling phase unchanged (AI expects dice already rolled)', () => {
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'easy');
    expect(next.phase).toBe('rolling');
    expect(next.currentDice).toBeNull();
  });
});
