/**
 * Wave 43 — executeAITurn in rolling is identity leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { executeAITurn } from '../../src/games/juggle/ai';

describe('Wave 43 juggle — execute rolling identity', () => {
  it('execute in rolling phase returns same state', () => {
    const s = createInitialState();
    expect(s.phase).toBe('rolling');
    expect(executeAITurn(s, 'player1', 'medium')).toEqual(s);
  });
});
