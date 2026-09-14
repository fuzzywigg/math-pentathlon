/**
 * Wave 43 — Ramrod formatMove capture suffix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { formatMove } from '../../src/games/ramrod/rules';
import type { RamrodMove, Rod } from '../../src/games/ramrod/types';

describe('Wave 43 ramrod — formatMove capture', () => {
  const rod: Rod = {
    id: 'r',
    length: 4,
    color: '#8e24aa',
    owner: 'player1',
    position: null,
  };

  it('formats plain and capture variants', () => {
    const plain: RamrodMove = {
      player: 'player1',
      rod,
      boxId: 'box-0-0',
      slot: 0,
      capturedBox: false,
      pointsScored: 0,
      moveNumber: 1,
    };
    expect(formatMove(plain)).toBe('Rod 4cm');
    const cap = { ...plain, capturedBox: true, pointsScored: 8 };
    expect(formatMove(cap)).toBe('Rod 4cm (+8cm)');
  });
});
