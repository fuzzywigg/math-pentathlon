/**
 * Wave 43 — Handshake hexagone cell count × stars board size. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState as hexInit } from '../../src/games/hex-a-gone/types';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import { CONFIG } from '../../src/games/stars-bars/types';

describe('Wave 43 handshake — hexagone×stars boards', () => {
  it('hex radius-3 has 37 cells; stars is CONFIG.BOARD_SIZE squared', () => {
    expect(hexInit().board).toHaveLength(37);
    const stars = starsInit();
    expect(stars.cells.flat()).toHaveLength(CONFIG.BOARD_SIZE * CONFIG.BOARD_SIZE);
  });
});
