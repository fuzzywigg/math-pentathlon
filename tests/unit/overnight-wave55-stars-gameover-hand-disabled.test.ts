/**
 * Wave 55 leftover after #250 — Stars gameOver disables current-player hand. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { renderPlayerHand } from '../../src/games/stars-bars/board-ui';

describe('Wave 55 stars — gameOver hand', () => {
  it('current seat cards disabled at gameOver', () => {
    const s = createInitialState();
    const el = renderPlayerHand(
      { ...s, phase: 'gameOver', winner: 'player1' },
      'player1',
      () => undefined
    );
    const cards = el.querySelectorAll('.stars-card');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((c) => {
      expect(c.classList.contains('disabled')).toBe(true);
      expect(c.getAttribute('aria-disabled')).toBe('true');
    });
  });
});
