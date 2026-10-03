/**
 * Overnight HEAVY leftovers after #234/#235 — FIAR gold win vs blocked orange.
 * Distinct from #235 valid-fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import { checkWinner, findPaths } from '../../src/games/fiar/rules';
import { renderBoard } from '../../src/games/fiar/board-ui';

function movement(
  placements: Array<{
    id: string;
    chip: 'player1' | 'player2';
    kind?: 'plain' | 'marked';
  }>
) {
  const base = createInitialState();
  const nodes = new Map(base.board.nodes);
  for (const p of placements) {
    nodes.set(p.id, {
      ...nodes.get(p.id)!,
      chip: p.chip,
      chipKind: p.kind ?? 'plain',
    });
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
      { id: 'c1r2', chip: 'player1' },
      { id: 'c2r2', chip: 'player1' },
      { id: 'c3r2', chip: 'player1' },
      { id: 'c4r2', chip: 'player1' },
      { id: 'c5r3', chip: 'player2' },
      { id: 'c6r3', chip: 'player2' },
      { id: 'c7r3', chip: 'player2' },
      { id: 'c8r3', chip: 'player2' },
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
      { id: 'c1r2', chip: 'player1' },
      { id: 'c2r2', chip: 'player1' },
      { id: 'c3r2', chip: 'player1' },
      { id: 'c4r2', chip: 'player1' },
      { id: 'c1r1', chip: 'player2', kind: 'marked' },
      { id: 'c5r3', chip: 'player2' },
      { id: 'c6r3', chip: 'player2' },
      { id: 'c7r3', chip: 'player2' },
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
