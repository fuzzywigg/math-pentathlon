/**
 * Wave 49 — Sum Dominoes renderHand player2 class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 sum — hand player2 class', () => {
  it('marks player2 hand with sd-hand-player2', () => {
    const el = renderHand(createInitialState(), 'player2', () => undefined);
    expect(el.className).toContain('sd-hand-player2');
  });
});
