/**
 * Overnight HEAVY after #214/#215 — Ramrod formatMove leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove } from '../../src/games/ramrod/rules';
import { createRod, type RamrodMove } from '../../src/games/ramrod/types';

describe('Overnight ramrod — formatMove', () => {
  it('renders plain and capture variants', () => {
    const rod = createRod('rod-x', 5);
    const move: RamrodMove = {
      player: 'player1',
      rod,
      boxId: 'box-0-0',
      slot: 0,
      capturedBox: true,
      pointsScored: 8,
      moveNumber: 1,
    };
    expect(formatMove({ ...move, capturedBox: false, pointsScored: 0 })).toBe('Rod 5cm');
    expect(formatMove(move)).toBe('Rod 5cm (+8cm)');
  });
});
