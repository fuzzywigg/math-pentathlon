/**
 * Wave 43 — Stars deck uniqueness leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState } from '../../src/games/stars-bars/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 stars-bars — deck unique ids', () => {
  it('all dealt cards across hands+deck have unique ids (60 total)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const all = [...s.playerHands.player1, ...s.playerHands.player2, ...s.deck];
    expect(all).toHaveLength(60);
    expect(new Set(all.map((c) => c.id)).size).toBe(60);
  });
});
