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
    for (const id of ['c1r2', 'c2r2', 'c3r2', 'c4r2']) {
      nodes.set(id, { ...nodes.get(id)!, chip: 'player1', chipKind: 'plain' });
    }
    nodes.set('c1r1', {
      ...nodes.get('c1r1')!,
      chip: 'player2',
      chipKind: 'marked',
    });
    for (const id of ['c5r1', 'c6r1', 'c6r2']) {
      nodes.set(id, { ...nodes.get(id)!, chip: 'player2', chipKind: 'plain' });
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
    const blocked = paths.filter(
      (p) => p.isBlocked && p.nodes.length >= CONFIG.WIN_LENGTH
    );
    expect(blocked.length).toBeGreaterThan(0);
    const svg = renderBoard(state, () => undefined);
    const orange = [...svg.querySelectorAll('circle')].filter(
      (c) =>
        c.getAttribute('stroke') === '#ff9800' &&
        c.getAttribute('stroke-width') === '3' &&
        Number(c.getAttribute('r')) === CONFIG.NODE_RADIUS
    );
    expect(orange.length).toBeGreaterThan(0);
  });
});
