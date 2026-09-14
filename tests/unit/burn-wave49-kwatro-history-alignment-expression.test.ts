/**
 * Wave 49 — Kwatro history alignment expression leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderMoveHistory } from '../../src/games/kwatro-sinko/board-ui';
import type { KwaMove } from '../../src/games/kwatro-sinko/types';

describe('Wave 49 kwatro — history alignment', () => {
  it('appends expression when alignment present', () => {
    const base = createInitialState();
    const chip = [...base.chips.values()][0]!;
    const move: KwaMove = {
      player: 'player1',
      chip,
      fromNode: 'n0-0',
      toNode: 'n1-0',
      alignment: {
        nodes: ['a', 'b'],
        chips: [chip],
        expression: '4 + 3 - 2 = 5',
        result: 5,
      },
      moveNumber: 1,
    };
    const el = renderMoveHistory({ ...base, moveHistory: [move] });
    const row = el.querySelector('.kwa-history-move')!;
    expect(row.textContent).toMatch(/Blue:/);
    expect(row.textContent).toContain(String(chip.value));
    expect(row.textContent).toContain('→ 4 + 3 - 2 = 5');
  });
});
