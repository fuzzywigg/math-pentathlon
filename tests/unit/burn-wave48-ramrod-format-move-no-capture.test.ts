/**
 * Wave 48 — Ramrod formatMove without capture suffix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove } from '../../src/games/ramrod/rules';
import { createRod } from '../../src/games/ramrod/types';

describe('Wave 48 ramrod — format no capture', () => {
  it('omits cm bonus when not captured', () => {
    const text = formatMove({
      player: 'player1',
      rod: createRod('rX', 4),
      boxId: 'box-0-0',
      slot: 0,
      capturedBox: false,
      pointsScored: 0,
      moveNumber: 1,
    });
    expect(text).toMatch(/4cm/);
    expect(text).not.toMatch(/\+/);
  });
});
