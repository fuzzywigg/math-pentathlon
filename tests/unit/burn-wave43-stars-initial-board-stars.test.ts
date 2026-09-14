/**
 * Wave 43 — Stars & Bars opening board star cells + hands. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState } from '../../src/games/stars-bars/rules';
import { CONFIG } from '../../src/games/stars-bars/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 stars-bars — initial board stars', () => {
  it('5x5 board with corner+center stars; hands dealt; deck leftover', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(s.cells).toHaveLength(CONFIG.BOARD_SIZE);
    expect(s.cells[0]).toHaveLength(CONFIG.BOARD_SIZE);
    const stars = s.cells.flat().filter((c) => c.isStar);
    expect(stars).toHaveLength(5);
    expect(s.cells[0][0].isStar).toBe(true);
    expect(s.cells[2][2].isStar).toBe(true);
    expect(s.cells[0][1].isStar).toBe(false);
    expect(s.playerHands.player1).toHaveLength(5);
    expect(s.playerHands.player2).toHaveLength(5);
    expect(s.deck.length).toBe(60 - 10);
    expect(s.phase).toBe('selectingCard');
  });
});
