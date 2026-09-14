/**
 * Wave 42 — Par 55 getAttributeDisplayName / formatMove leftovers after #186. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  formatMove,
  getAttributeDisplayName,
} from '../../src/games/par-55/rules';
import type { Par55Move } from '../../src/games/par-55/types';

describe('Wave 42 par — display and formatMove', () => {
  it('getAttributeDisplayName capitalizes all four attribute keys', () => {
    expect(getAttributeDisplayName('shape')).toBe('Shape');
    expect(getAttributeDisplayName('color')).toBe('Color');
    expect(getAttributeDisplayName('size')).toBe('Size');
    expect(getAttributeDisplayName('thickness')).toBe('Thickness');
  });

  it('getAttributeDisplayName passthrough for unknown keys', () => {
    expect(getAttributeDisplayName('weight')).toBe('weight');
    expect(getAttributeDisplayName('')).toBe('');
    expect(getAttributeDisplayName('SHAPE')).toBe('SHAPE');
  });

  it('formatMove orders size thickness color shape then points', () => {
    const block = createInitialState().hands.player1[0];
    const move: Par55Move = {
      player: 'player1',
      block,
      baseId: 'base-1-2',
      pointsScored: 7,
      matchDetails: [],
      moveNumber: 3,
    };
    const formatted = formatMove(move);
    expect(formatted).toBe(
      `${block.size} ${block.thickness} ${block.color} ${block.shape} → 7 pts`
    );
  });

  it('formatMove reflects zero points', () => {
    const block = createInitialState().hands.player2[0];
    const formatted = formatMove({
      player: 'player2',
      block,
      baseId: 'base-0-1',
      pointsScored: 0,
      matchDetails: [],
      moveNumber: 1,
    });
    expect(formatted).toContain('0 pts');
    expect(formatted).toContain(block.shape);
  });
});
