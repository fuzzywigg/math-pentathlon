/**
 * #384 — movement-phase movable chips announce "selectable" in aria-label.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';
import { getSelectableNodes, getValidMoves } from '../../src/games/fiar/rules';
import { buildCellAriaLabel } from '../../src/ui/board-a11y';

function forgeMovementState() {
  const base = createInitialState();
  for (const [id, n] of base.board.nodes) {
    base.board.nodes.set(id, { ...n, chip: null, chipKind: undefined });
  }
  const place = (id: string, chip: 'player1' | 'player2') => {
    const n = base.board.nodes.get(id)!;
    base.board.nodes.set(id, { ...n, chip, chipKind: 'plain' as const });
  };
  place('c2r1', 'player1');
  place('c6r1', 'player1');
  place('c2r3', 'player1');
  place('c6r3', 'player1');
  place('c2r5', 'player2');
  place('c6r5', 'player2');
  place('c4r1', 'player2');
  place('c4r5', 'player2');
  return {
    ...base,
    phase: 'movement' as const,
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
    currentPlayer: 'player1' as const,
    selectedNode: null,
    winner: null,
  };
}

describe('FIAR movement aria selectable (#384)', () => {
  it('buildCellAriaLabel appends selectable when requested', () => {
    expect(
      buildCellAriaLabel({
        coord: '1,2',
        owner: 'Blue',
        selectable: true,
      })
    ).toBe('1,2, Blue, selectable');
  });

  it('movable current-player chips include selectable; destinations use valid move', () => {
    const state = forgeMovementState();
    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);

    const svg = renderBoard(state, () => undefined);
    for (const id of selectable) {
      const label =
        svg.querySelector(`[data-node-id="${id}"]`)!.getAttribute(
          'aria-label'
        ) || '';
      expect(label).toMatch(/selectable/);
      expect(label).not.toMatch(/valid move/);
    }

    // Opponent chips must not be announced as selectable.
    const oppLabel =
      svg.querySelector('[data-node-id="c2r5"]')!.getAttribute('aria-label') ||
      '';
    expect(oppLabel).toMatch(/Red/);
    expect(oppLabel).not.toMatch(/selectable/);

    // After selection, destinations announce valid move (not selectable).
    const pick = selectable[0]!;
    const selectedState = { ...state, selectedNode: pick };
    const moves = getValidMoves(selectedState, pick);
    expect(moves.length).toBeGreaterThan(0);

    const svg2 = renderBoard(selectedState, () => undefined);
    const destLabel =
      svg2
        .querySelector(`[data-node-id="${moves[0]}"]`)!
        .getAttribute('aria-label') || '';
    expect(destLabel).toMatch(/valid move/);
    expect(destLabel).not.toMatch(/selectable/);
  });
});
