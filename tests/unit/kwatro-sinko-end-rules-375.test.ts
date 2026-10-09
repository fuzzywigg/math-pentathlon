/**
 * Regression for #375 — Kwatro-Sinko must not end on a home-row slide.
 * Official Div II Highlights: win requires ALL 5 chips off numbered spaces
 * AND a valid like+like−opposite alignment totaling 4 or 5.
 *
 * Hard AI uses DIFFICULTY_CONFIG.hard.randomness (3%) to occasionally pick among
 * the top scored moves — seed Math.random in the forced-win case so the suite
 * does not flake on chip identity (tests-only; no AI/rules changes).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createInitialState,
  selectChip,
  moveChip,
  allChipsOffNumbered,
  getValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import { getAIMove, executeAITurn } from '../../src/games/kwatro-sinko/ai';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';

afterEach(() => {
  // Do not restoreAllMocks — shared isolate:false graph hosts hoisted vi.mock.
  const randomFn = Math.random as unknown as { mockRestore?: () => void };
  randomFn.mockRestore?.();
});

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

/** Issue #375 reproduction: Blue slides 2 along the home row after Red's reply. */
function playIssue375Line(): KwaState {
  let state = createInitialState();
  // Blue: 4 chip (0,2) → (1,2)
  state = moveChip(selectChip(state, 'p1-2'), 'n1-2');
  // Red: any reply (4,0) → (3,0)
  state = moveChip(selectChip(state, 'p2-0'), 'n3-0');
  // Blue: 2 chip (0,1) → (0,2) — home-row 2,6,8 would spuriously win before the fix
  state = moveChip(selectChip(state, 'p1-1'), 'n0-2');
  return state;
}

/**
 * Legal win for Blue: all five Blue chips off numbered rows, then complete
 * 6 + 2 − 3 = 5 on row 2 (two Blue + one Red).
 */
function forgeLegalBlueWin(): KwaState {
  let state = createInitialState();
  state = placeChip(state, 'p1-3', 'n2-0'); // 6
  state = placeChip(state, 'p2-1', 'n2-1'); // 3
  state = placeChip(state, 'p1-1', 'n1-2'); // 2 → n2-2
  state = placeChip(state, 'p1-0', 'n1-0'); // 0
  state = placeChip(state, 'p1-2', 'n1-1'); // 4
  state = placeChip(state, 'p1-4', 'n1-3'); // 8
  return state;
}

/**
 * Legal win for Red (human vs human): all five Red chips off numbered rows,
 * then complete 1 + 9 − 6 = 4 on row 2.
 */
function forgeLegalRedWin(): KwaState {
  let state = createInitialState();
  state = { ...state, currentPlayer: 'player2' };
  state = placeChip(state, 'p2-4', 'n2-0'); // 9
  state = placeChip(state, 'p1-3', 'n2-1'); // 6
  state = placeChip(state, 'p2-0', 'n1-2'); // 1 → n2-2
  state = placeChip(state, 'p2-1', 'n1-0');
  state = placeChip(state, 'p2-2', 'n1-1');
  state = placeChip(state, 'p2-3', 'n1-3');
  return state;
}

describe('Kwatro-Sinko #375 — does not end on move 2', () => {
  it('human vs human: home-row slide leaves game in progress', () => {
    const state = playIssue375Line();
    expect(state.moveHistory).toHaveLength(3);
    expect(state.phase).toBe('selectingChip');
    expect(state.winner).toBeNull();
    expect(state.winningAlignment).toBeNull();
    expect(state.currentPlayer).toBe('player2');
    // Top row reads 0, ., 2, 6, 8 — arithmetic 2+8-6=4 is not a legal win
    expect(state.nodes.get('n0-2')?.chip?.value).toBe(2);
    expect(state.nodes.get('n0-3')?.chip?.value).toBe(6);
    expect(state.nodes.get('n0-4')?.chip?.value).toBe(8);
    expect(allChipsOffNumbered(state.nodes, state.chips, 'player1')).toBe(
      false
    );
  });

  it('vs computer: after the same Blue line, Hard AI reply does not end on move 2', () => {
    let state = createInitialState();
    state = moveChip(selectChip(state, 'p1-2'), 'n1-2');
    expect(state.phase).not.toBe('gameOver');

    state = executeAITurn(state, 'player2', 'hard');
    expect(state.phase).not.toBe('gameOver');
    expect(state.winner).toBeNull();
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(2);

    // Blue's home-row slide still does not win
    const slideDest = 'n0-2';
    expect(getValidMoves(state, 'p1-1')).toContain(slideDest);
    state = moveChip(selectChip(state, 'p1-1'), slideDest);
    expect(state.phase).not.toBe('gameOver');
    expect(state.winner).toBeNull();
  });
});

describe('Kwatro-Sinko #375 — ends only under official conditions', () => {
  it('human vs human: Blue wins with chips off numbered + mixed-color alignment', () => {
    const state = forgeLegalBlueWin();
    // All five Blue chips already sit on non-numbered spaces; the clinching
    // move completes the like+like−opposite path.
    expect(allChipsOffNumbered(state.nodes, state.chips, 'player1')).toBe(true);

    const result = moveChip(selectChip(state, 'p1-1'), 'n2-2');
    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
    expect(result.winningAlignment?.result).toBe(5);
    expect(result.winningAlignment?.expression).toContain('= 5');
    expect(allChipsOffNumbered(result.nodes, result.chips, 'player1')).toBe(
      true
    );
  });

  it('human vs human: Red wins with chips off numbered + mixed-color alignment', () => {
    const result = moveChip(selectChip(forgeLegalRedWin(), 'p2-0'), 'n2-2');
    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player2');
    expect(result.winningAlignment?.result).toBe(4);
    expect(result.winningAlignment?.chips.map((c) => c.value).sort()).toEqual([
      1, 6, 9,
    ]);
    expect(allChipsOffNumbered(result.nodes, result.chips, 'player2')).toBe(
      true
    );
  });

  it('alignment alone (chips still on numbered) does not end the game', () => {
    // Same geometry as a legal Blue win, but leave two Blue chips on row 0
    let state = createInitialState();
    state = placeChip(state, 'p1-3', 'n2-0'); // 6
    state = placeChip(state, 'p2-1', 'n2-1'); // 3
    state = placeChip(state, 'p1-1', 'n1-2'); // 2 → n2-2
    // p1-0, p1-2, p1-4 remain on numbered row 0
    const result = moveChip(selectChip(state, 'p1-1'), 'n2-2');
    expect(result.phase).toBe('selectingChip');
    expect(result.winner).toBeNull();
    expect(result.winningAlignment).toBeNull();
    expect(result.currentPlayer).toBe('player2');
  });

  it('all chips off numbered without a mixed-color alignment does not end the game', () => {
    let state = createInitialState();
    state = placeChip(state, 'p1-0', 'n1-0');
    state = placeChip(state, 'p1-1', 'n1-1');
    state = placeChip(state, 'p1-2', 'n1-3');
    state = placeChip(state, 'p1-3', 'n1-4');
    state = placeChip(state, 'p1-4', 'n0-2'); // last chip still numbered
    const result = moveChip(selectChip(state, 'p1-4'), 'n1-2');
    expect(allChipsOffNumbered(result.nodes, result.chips, 'player1')).toBe(
      true
    );
    expect(result.phase).toBe('selectingChip');
    expect(result.winner).toBeNull();
    expect(result.winningAlignment).toBeNull();
  });

  it('vs computer: Hard AI can convert a forced legal win', () => {
    const state = forgeLegalBlueWin();
    // Stay off the Hard randomness branch (Math.random() < 0.03) so the
    // top-scored win (p1-1 → n2-2) is selected deterministically.
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Seat is Blue; treat Blue as the AI for this forced position
    const aiMove = getAIMove(state, 'player1', 'hard');
    expect(aiMove).not.toBeNull();
    expect(aiMove!.chipId).toBe('p1-1');
    expect(aiMove!.nodeId).toBe('n2-2');
    const after = executeAITurn(state, 'player1', 'hard');
    expect(after.phase).toBe('gameOver');
    expect(after.winner).toBe('player1');
    expect(after.winningAlignment?.result).toBe(5);
  });
});
