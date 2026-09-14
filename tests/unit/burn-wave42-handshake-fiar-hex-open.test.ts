/**
 * Wave 42 handshake — fiar placement × hex empty board.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as fiarInit } from '../../src/games/fiar/types';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { canPlaceChip } from '../../src/games/fiar/rules';
import { getValidMoves } from '../../src/games/hex/rules';

describe('Wave 42 handshake — fiar × hex', () => {
  it('fiar can place; hex has size² valids', () => {
    const f = fiarInit();
    const h = hexInit(4);
    expect(canPlaceChip(f, '2-2')).toBe(true);
    expect(getValidMoves(h)).toHaveLength(16);
    expect(f.winner).toBeNull();
    expect(h.winner).toBeNull();
  });
});
