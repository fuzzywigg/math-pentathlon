/**
 * Wave 46 — Kwatro createChip shape leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createChip, isWinningValue } from '../../src/games/kwatro-sinko/types';

describe('Wave 46 kwatro — createChip', () => {
  it('createChip defaults position null; winning fence', () => {
    expect(createChip('x', 7, 'player2')).toEqual({
      id: 'x',
      value: 7,
      owner: 'player2',
      position: null,
    });
    expect(isWinningValue(4)).toBe(true);
    expect(isWinningValue(0)).toBe(false);
  });
});
