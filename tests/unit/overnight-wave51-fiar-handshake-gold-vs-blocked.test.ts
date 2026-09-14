/**
 * Overnight HEAVY leftovers after #234/#235 — FIAR gold win vs blocked orange.
 * Distinct from #235 valid-fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import { checkWinner, findPaths } from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

function movement(
  placements: Array<{ id: string; chip: 'player1' | 'player2' }>
) {
  const base = createInitialState();
  const nodes = new Map(base.board.nodes);
  for (const p of placements) {
    nodes.set(p.id, { ...nodes.get(p.id)!, chip: p.chip });
  }
  return {
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
}

describe('Wave 51 fiar — gold vs blocked handshake', () => {
  it('unblocked win uses #ffd700; blocked four uses width-3 #ff9800', () => {
    const win = movement([
      { id: '2-0', chip: 'player1' },
      { id: '2-1', chip: 'player1' },
      { id: '2-2', chip: 'player1' },
      { id: '2-3', chip: 'player1' },
      { id: '0-0', chip: 'player2' },
      { id: '0-1', chip: 'player2' },
      { id: '0-2', chip: 'player2' },
      { id: '0-3', chip: 'player2' },
    ]);
    expect(checkWinner(win)).toBe('player1');
    const winSvg = renderBoard(win, () => undefined);
    expect(
      [...winSvg.querySelectorAll('circle')].some(
        (c) =>
          c.getAttribute('stroke') === '#ffd700' &&
          c.getAttribute('stroke-width') === '4'
      )
    ).toBe(true);

    const blocked = movement([
      { id: '2-0', chip: 'player1' },
      { id: '2-1', chip: 'player1' },
      { id: '2-2', chip: 'player1' },
      { id: '2-3', chip: 'player1' },
      { id: '1-1', chip: 'player2' },
      { id: '0-0', chip: 'player2' },
      { id: '0-1', chip: 'player2' },
      { id: '0-2', chip: 'player2' },
    ]);
    expect(
      findPaths(blocked, 'player1').some(
        (p) => p.isBlocked && p.nodes.length >= CONFIG.WIN_LENGTH
      )
    ).toBe(true);
    const blockedSvg = renderBoard(blocked, () => undefined);
    expect(
      [...blockedSvg.querySelectorAll('circle')].some(
        (c) =>
          c.getAttribute('stroke') === '#ff9800' &&
          c.getAttribute('stroke-width') === '3' &&
          Number(c.getAttribute('r')) === CONFIG.NODE_RADIUS
      )
    ).toBe(true);
  });
});
