/**
 * Wave 51 leftover after #233 — Stars-Bars valid cell + preview title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectCard,
  getValidPlacements,
} from '../../src/games/stars-bars/rules';
import { renderBoard } from '../../src/games/stars-bars/board-ui';

describe('Wave 51 stars — valid preview title', () => {
  it('marks .valid cells with +N points title', () => {
    const base = createInitialState();
    const card = base.playerHands.player1[0];
    const state = selectCard(base, card.id);
    const placements = getValidPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const el = renderBoard(state, () => undefined);
    const valids = el.querySelectorAll('.stars-cell.valid');
    expect(valids.length).toBe(placements.length);
    expect([...valids].every((c) => /\+\d+ points/.test((c as HTMLElement).title))).toBe(true);
  });
});
