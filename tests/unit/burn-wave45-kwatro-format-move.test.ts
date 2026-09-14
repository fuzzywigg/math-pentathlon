/**
 * Wave 45 TOKENMAXX — Kwatro formatMove leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove } from '../../src/games/kwatro-sinko/rules';
import { createChip } from '../../src/games/kwatro-sinko/types';

describe('Wave 45 kwatro — formatMove', () => {
  it('non-empty string includes nodes', () => {
    const text = formatMove({
      player: 'player1',
      chip: createChip('p1-0', 0, 'player1'),
      fromNode: 'n0-0',
      toNode: 'n1-0',
      alignment: null,
      moveNumber: 1,
    });
    expect(text.length).toBeGreaterThan(0);
    expect(text).toMatch(/Chip 0/);
  });
});
