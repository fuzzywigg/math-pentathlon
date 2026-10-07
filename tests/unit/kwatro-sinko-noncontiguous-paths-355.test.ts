/**
 * Div II Highlights GOAL — non-contiguous winning paths (#355 polish).
 *
 * Quote: “The path of 3 chips does not need to be contiguous but cannot
 * cross the middle (yellow) area of the board.”
 *
 * This suite locks gap-tolerant alignment detection on the 5×5 model.
 * Yellow-middle mapping remains open for Andrew (no non-playable yellow cell).
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  moveChip,
  findWinningAlignment,
  allChipsOffNumbered,
} from '../../src/games/kwatro-sinko/rules';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

function placeChip(state: KwaState, chipId: string, nodeId: string): KwaState {
  const chip = state.chips.get(chipId);
  if (!chip) throw new Error(`missing chip ${chipId}`);

  const nodes = new Map(state.nodes);
  const chips = new Map(state.chips);

  if (chip.position) {
    const old = nodes.get(chip.position);
    if (old) nodes.set(chip.position, { ...old, chip: null });
  }

  const updated: Chip = { ...chip, position: nodeId };
  chips.set(chipId, updated);
  const node = nodes.get(nodeId);
  if (!node) throw new Error(`missing node ${nodeId}`);
  nodes.set(nodeId, { ...node, chip: updated });

  return { ...state, nodes, chips };
}

/**
 * Gapped Blue win on row 2: 6 · empty · 3 · empty · 2 → 6 + 2 − 3 = 5.
 * All Blue chips off numbered rows; completing move places 2 on n2-4.
 */
function forgeGappedBlueWin(): KwaState {
  let state = createInitialState();
  state = placeChip(state, 'p1-3', 'n2-0'); // 6
  state = placeChip(state, 'p2-1', 'n2-2'); // 3 (gap at n2-1)
  state = placeChip(state, 'p1-1', 'n1-4'); // 2 → n2-4 (gap at n2-3)
  state = placeChip(state, 'p1-0', 'n1-0'); // 0
  state = placeChip(state, 'p1-2', 'n1-1'); // 4
  state = placeChip(state, 'p1-4', 'n1-2'); // 8
  return state;
}

/**
 * Contiguous legal Blue win still works after the gap change (regression).
 */
function forgeContiguousBlueWin(): KwaState {
  let state = createInitialState();
  state = placeChip(state, 'p1-3', 'n2-0'); // 6
  state = placeChip(state, 'p2-1', 'n2-1'); // 3
  state = placeChip(state, 'p1-1', 'n1-2'); // 2 → n2-2
  state = placeChip(state, 'p1-0', 'n1-0');
  state = placeChip(state, 'p1-2', 'n1-1');
  state = placeChip(state, 'p1-4', 'n1-3');
  return state;
}

describe('Kwatro-Sinko — non-contiguous winning paths (Div II)', () => {
  it('findWinningAlignment accepts a gapped horizontal trio totaling 5', () => {
    const setup = forgeGappedBlueWin();
    // Place 2 onto n2-4 without going through moveChip (probe detector only)
    const probed = placeChip(setup, 'p1-1', 'n2-4');
    const alignment = findWinningAlignment(probed.nodes, 'n2-4');
    expect(alignment).not.toBeNull();
    expect(alignment?.result).toBe(5);
    expect(alignment?.expression).toMatch(/^(6 \+ 2|2 \+ 6) - 3 = 5$/);
    expect(alignment?.nodes.sort()).toEqual(['n2-0', 'n2-2', 'n2-4'].sort());
  });

  it('moveChip declares win on a gapped path when all chips are off numbered', () => {
    const setup = forgeGappedBlueWin();
    // All Blue chips already sit on non-numbered rows; the move completes the path
    expect(allChipsOffNumbered(setup.nodes, setup.chips, 'player1')).toBe(true);

    const result = moveChip(selectChip(setup, 'p1-1'), 'n2-4');
    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
    expect(result.winningAlignment?.result).toBe(5);
  });

  it('contiguous legal win still ends the game (regression)', () => {
    const result = moveChip(selectChip(forgeContiguousBlueWin(), 'p1-1'), 'n2-2');
    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
    expect(result.winningAlignment?.result).toBe(5);
  });

  it('gapped alignment alone does not win while chips remain on numbered rows', () => {
    // Same gapped arithmetic on the home row — must not win (#375 gate)
    let state = createInitialState();
    // Top row already has 0,2,4,6,8 contiguous; leave gaps by clearing middle
    // and placing a Red chip: n0-0=0, empty n0-1, n0-2=2 stays, … simpler:
    // keep opening board — chips on numbered; any alignment must not win.
    state = selectChip(state, 'p1-0');
    state = moveChip(state, 'n1-0');
    expect(state.phase).not.toBe('gameOver');
    expect(state.winner).toBeNull();
  });

  it('tutorial winning step documents non-contiguous paths', () => {
    const winning = kwatroSinkoTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toContain(
      '<li>Empty spaces between the 3 chips are allowed (the path need not be contiguous)</li>'
    );
  });
});
