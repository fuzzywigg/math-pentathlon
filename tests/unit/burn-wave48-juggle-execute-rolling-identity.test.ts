/**
 * Wave 48 — Juggle executeAITurn from rolling is identity (no auto-roll). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { executeAITurn } from '../../src/games/juggle/ai';

describe('Wave 48 juggle — execute rolling identity', () => {
  it('returns same reference when still in rolling phase', () => {
    const s = createInitialState();
    expect(executeAITurn(s, 'player1', 'easy')).toBe(s);
  });
});
