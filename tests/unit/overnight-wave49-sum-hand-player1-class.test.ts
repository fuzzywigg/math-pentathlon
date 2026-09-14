/**
 * Wave 49 — Sum Dominoes renderHand player1 class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 sum — hand player1 class', () => {
  it('marks player1 hand with sd-hand-player1', () => {
    const el = renderHand(createInitialState(), 'player1', () => undefined);
    expect(el.className).toContain('sd-hand-player1');
  });
});
