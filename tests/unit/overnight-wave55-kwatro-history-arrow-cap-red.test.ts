/**
 * Wave 55 leftover after #250 — Kwatro history alignment arrow, cap 6, Red seat. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory } from '../../src/games/kwatro-sinko/board-ui';
import type { Chip, KwaMove } from '../../src/games/kwatro-sinko/types';

const chip = (value: number, owner: Chip['owner']): Chip => ({
  id: `c${value}`,
  value,
  owner,
  position: 'n0-0',
});

describe('Wave 55 kwatro — history chrome', () => {
  it('arrow expr, last 6, Red class', () => {
    const base = createInitialState();
    const moveHistory: KwaMove[] = Array.from({ length: 8 }, (_, i) => ({
      player: i === 7 ? 'player2' : 'player1',
      chip: i === 7 ? chip(7, 'player2') : chip(6, 'player1'),
      fromNode: 'n0-0',
      toNode: 'n1-1',
      alignment:
        i === 7
          ? null
          : i === 6
            ? {
                nodes: ['a', 'b', 'c'],
                chips: [],
                expression: '6 + 3 - 5 = 4',
                result: 4,
              }
            : null,
      moveNumber: i + 1,
    }));
    const el = renderMoveHistory({ ...base, moveHistory });
    const items = el.querySelectorAll('.kwa-history-move');
    expect(items).toHaveLength(6);
    expect(el.textContent).toMatch(/Blue: 6 → 6 \+ 3 - 5 = 4/);
    expect(items[5]?.classList.contains('player2')).toBe(true);
    expect(items[5]?.textContent).toMatch(/Red: 7/);
  });
});
