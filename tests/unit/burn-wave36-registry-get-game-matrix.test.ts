/**
 * Wave 36 — getGameById matrix + unknown id.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { GAMES, getGameById } from '../../src/core/game-registry';

describe('Wave 36 registry-get — id matrix', () => {
  it('every GAMES id round-trips through getGameById', () => {
    for (const g of GAMES) {
      expect(getGameById(g.id)).toEqual(g);
    }
  });

  it('unknown / empty ids are undefined', () => {
    expect(getGameById('')).toBeUndefined();
    expect(getGameById('no-such-game')).toBeUndefined();
    expect(getGameById('HEX')).toBeUndefined(); // case-sensitive
  });
});
