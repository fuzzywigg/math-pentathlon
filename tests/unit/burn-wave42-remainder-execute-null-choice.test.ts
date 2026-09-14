/**
 * Wave 42 — Remainder executeAISelection null when rolling. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { executeAISelection } from '../../src/games/remainder-islands/ai';
import { createInitialState } from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — execute null', () => {
  it('rolling phase execute returns same state', () => {
    const s = createInitialState();
    expect(executeAISelection(s, 'player1', 'hard')).toBe(s);
  });
});
