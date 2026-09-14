/**
 * Overnight HEAVY leftovers after #234 — FIAR winning-path gold stroke.
 * Distinct from #233 selected/pulse/edge leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import { checkWinner } from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 51 fiar — winning path gold', () => {
  it('strokes unblocked length-4 path nodes with #ffd700', () => {
    const base = createInitialState();
    const nodes = new Map(base.board.nodes);
    for (const id of ['2-0', '2-1', '2-2', '2-3']) {
      nodes.set(id, { ...nodes.get(id)!, chip: 'player1' });
    }
    // opponent chips elsewhere so movement phase is legal
    for (const id of ['0-0', '0-1', '0-2', '0-3']) {
      nodes.set(id, { ...nodes.get(id)!, chip: 'player2' });
    }
    const state = {
      ...base,
      board: { ...base.board, nodes },
      phase: 'movement' as const,
      chipsPlaced: {
        player1: CONFIG.CHIPS_PER_PLAYER,
        player2: CONFIG.CHIPS_PER_PLAYER,
      },
      currentPlayer: 'player1' as const,
    };
    expect(checkWinner(state)).toBe('player1');
    const svg = renderBoard(state, () => undefined);
    const gold = [...svg.querySelectorAll('circle')].filter(
      (c) =>
        c.getAttribute('stroke') === '#ffd700' &&
        c.getAttribute('stroke-width') === '4' &&
        Number(c.getAttribute('r')) === CONFIG.NODE_RADIUS
    );
    expect(gold.length).toBeGreaterThanOrEqual(4);
  });
});
