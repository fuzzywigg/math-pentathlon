/**
 * Wave 46 — Kwatro formatMove with alignment leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove } from '../../src/games/kwatro-sinko/rules';
import type { KwaMove } from '../../src/games/kwatro-sinko/types';

describe('Wave 46 kwatro — format alignment', () => {
  it('includes expression when alignment present', () => {
    const move: KwaMove = {
      player: 'player1',
      chip: { id: 'p1-0', value: 4, owner: 'player1', position: 'n2-2' },
      fromNode: 'n1-2',
      toNode: 'n2-2',
      alignment: {
        nodes: ['n2-0', 'n2-1', 'n2-2'],
        chips: [],
        expression: '0 + 6 - 2 = 4',
        result: 4,
      },
      moveNumber: 3,
    };
    expect(formatMove(move)).toContain('4');
    expect(formatMove(move)).toContain('0 + 6 - 2 = 4');
  });
});
