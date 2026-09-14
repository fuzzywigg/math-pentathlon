/**
 * Wave 49 leftover after #221/#226/#227 — Stars opponent hand disabled. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { renderPlayerHand } from '../../src/games/stars-bars/board-ui';

describe('Wave 49 stars — opponent hand', () => {
  it('disables opponent cards', () => {
    const el = renderPlayerHand(createInitialState(), 'player2', () => undefined);
    const cards = el.querySelectorAll('.stars-card');
    expect(cards.length).toBeGreaterThan(0);
    expect([...cards].every((c) => c.classList.contains('disabled'))).toBe(true);
  });
});
