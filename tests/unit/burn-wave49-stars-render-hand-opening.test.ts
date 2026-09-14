/**
 * Wave 49 leftover after #221/#226/#227 — Stars renderPlayerHand opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { CONFIG } from '../../src/games/stars-bars/types';
import { renderPlayerHand } from '../../src/games/stars-bars/board-ui';

describe('Wave 49 stars — hand', () => {
  it('renders HAND_SIZE cards for current player', () => {
    const state = createInitialState();
    const el = renderPlayerHand(state, 'player1', () => undefined);
    expect(el.classList.contains('stars-hand-container')).toBe(true);
    expect(el.querySelectorAll('.stars-card').length).toBe(CONFIG.HAND_SIZE);
    expect(el.textContent).toMatch(/Blue/);
  });
});
