/**
 * Wave 43 — Ramrod formatMove capture suffix leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { type Rod, type RamrodMove } from '../../src/games/ramrod/types';
import { formatMove } from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — formatMove', () => {
  it('with and without capture suffix', () => {
    const rod: Rod = { id: 'r', length: 7, color: '#0', owner: 'player1', position: null };
    const base: RamrodMove = {
      player: 'player1',
      rod,
      boxId: '0-0',
      slot: 0,
      capturedBox: false,
      pointsScored: 0,
      moveNumber: 1,
    };
    expect(formatMove(base)).toBe('Rod 7cm');
    expect(formatMove({ ...base, capturedBox: true, pointsScored: 9 })).toBe('Rod 7cm (+9cm)');
  });
});
