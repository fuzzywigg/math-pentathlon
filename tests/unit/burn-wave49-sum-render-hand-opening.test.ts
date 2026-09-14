/**
 * Wave 49 leftover after #221/#226/#227 — Sum Dominoes renderHand opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 sum — hand', () => {
  it('renders hand container with dominoes for player1', () => {
    const state = createInitialState();
    const el = renderHand(state, 'player1', () => undefined);
    expect(el.classList.contains('sd-hand')).toBe(true);
    expect(el.children.length).toBe(state.hands.player1.length);
  });
});
