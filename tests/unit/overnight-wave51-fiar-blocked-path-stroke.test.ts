/**
 * Overnight HEAVY leftovers after #234 — FIAR blocked-path orange stroke.
 * Distinct from gold winning-path leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import { findPaths } from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 51 fiar — blocked path stroke', () => {
  it('strokes blocked length-4 path with #ff9800 when adjacent opponent blocks', () => {
    const base = createInitialState();
    const nodes = new Map(base.board.nodes);
    // Horizontal four for p1
    for (const id of ['2-0', '2-1', '2-2', '2-3']) {
      nodes.set(id, { ...nodes.get(id)!, chip: 'player1' });
    }
    // Adjacent blocker on the path side
    nodes.set('1-1', { ...nodes.get('1-1')!, chip: 'player2' });
    // Fill remaining p2 chips for movement phase
    for (const id of ['0-0', '0-1', '0-2']) {
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
      selectedNode: null,
    };
    const paths = findPaths(state, 'player1');
    const blocked = paths.filter((p) => p.isBlocked && p.nodes.length >= CONFIG.WIN_LENGTH);
    expect(blocked.length).toBeGreaterThan(0);
    const svg = renderBoard(state, () => undefined);
    // blocked uses #ff9800 stroke width 3 (not selected width 4)
    const orange = [...svg.querySelectorAll('circle')].filter(
      (c) =>
        c.getAttribute('stroke') === '#ff9800' &&
        c.getAttribute('stroke-width') === '3' &&
        Number(c.getAttribute('r')) === CONFIG.NODE_RADIUS
    );
    expect(orange.length).toBeGreaterThan(0);
  });
});
