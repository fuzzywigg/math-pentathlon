/**
 * Wave 49 — Par55 history points/attrs leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderMoveHistory } from '../../src/games/par-55/board-ui';
import type { Par55Move } from '../../src/games/par-55/types';

describe('Wave 49 par55 — history row', () => {
  it('shows player, attrs, and points', () => {
    const base = createInitialState();
    const block = base.hands.player1[0]!;
    const move: Par55Move = {
      player: 'player1',
      block,
      baseId: 'b-0-0',
      pointsScored: 9,
      matchDetails: [],
      moveNumber: 1,
    };
    const el = renderMoveHistory({ ...base, moveHistory: [move] });
    const row = el.querySelector('.par55-history-move')!;
    expect(row.textContent).toMatch(/Blue:/);
    expect(row.textContent).toContain(`${block.color} ${block.shape}`);
    expect(row.textContent).toContain('(+9)');
  });
});
