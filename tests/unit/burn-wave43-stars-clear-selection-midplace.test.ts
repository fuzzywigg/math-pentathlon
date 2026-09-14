/**
 * Wave 43 — Stars clearSelection mid-place leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  selectCard,
  clearSelection,
  placeCard,
} from '../../src/games/stars-bars/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 stars-bars — clear mid-place', () => {
  it('clear then reselect different card places successfully', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const [a, b] = s.playerHands.player1;
    const cleared = clearSelection(selectCard(s, a.id));
    const next = placeCard(selectCard(cleared, b.id), 1, 1);
    expect(next.cells[1][1].card?.id).toBe(b.id);
  });
});
