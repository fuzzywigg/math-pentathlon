/**
 * Wave 59 Contig/SD residual — Sum CONFIG hand/center invariants. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG } from '../../src/games/sum-dominoes/types';

describe('Wave 59 sum — CONFIG invariants', () => {
  it('pins board size, starting hand, center cell', () => {
    expect(CONFIG.BOARD_SIZE).toBe(11);
    expect(CONFIG.STARTING_HAND_SIZE).toBe(7);
    expect(CONFIG.CENTER_ROW).toBe(5);
    expect(CONFIG.CENTER_COL).toBe(5);
  });
});
