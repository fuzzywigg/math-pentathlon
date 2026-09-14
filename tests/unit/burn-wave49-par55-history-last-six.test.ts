/**
 * Wave 49 — Par55 history last-6 slice leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderMoveHistory } from '../../src/games/par-55/board-ui';
import type { Par55Move, AttributeBlock } from '../../src/games/par-55/types';

describe('Wave 49 par55 — history last six', () => {
  it('shows only trailing six moves', () => {
    const base = createInitialState();
    const block: AttributeBlock = {
      id: 'blk',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    };
    const moves: Par55Move[] = Array.from({ length: 8 }, (_, i) => ({
      player: i % 2 === 0 ? 'player1' : 'player2',
      block,
      baseId: `b-${i}`,
      pointsScored: i,
      matchDetails: [],
      moveNumber: i + 1,
    }));
    const el = renderMoveHistory({ ...base, moveHistory: moves });
    const rows = [...el.querySelectorAll('.par55-history-move')];
    expect(rows.length).toBe(6);
    expect(rows[0]?.textContent).toMatch(/^3\./);
    expect(rows[5]?.textContent).toMatch(/^8\./);
  });
});
