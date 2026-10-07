/**
 * Lock live Kwatro-Sinko engine behavior after #391 against Div II Highlights.
 *
 * Official source:
 * https://www.mathpentath.org/wp-content/uploads/2026/01/Highlights-Division-2.pdf
 *
 * These tests freeze what the 5×5 engine *actually does* so polish stays safe.
 * Open calls for Andrew (non-contiguous paths, yellow middle, full-board diagonals)
 * are asserted as current gaps — not implemented here.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  moveChip,
  getValidMoves,
  allChipsOffNumbered,
  findWinningAlignment,
  checkTrioForWin,
} from '../../src/games/kwatro-sinko/rules';
import type { Chip, KwaState, Player } from '../../src/games/kwatro-sinko/types';

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

function placeAll(
  state: KwaState,
  placements: Array<[string, string]>
): KwaState {
  return placements.reduce(
    (s, [chipId, nodeId]) => placeChip(s, chipId, nodeId),
    state
  );
}

/** Interior 3×3 node ids (rows/cols 1..3). */
const CENTER_3X3 = [
  'n1-1',
  'n1-2',
  'n1-3',
  'n2-1',
  'n2-2',
  'n2-3',
  'n3-1',
  'n3-2',
  'n3-3',
];

describe('Kwatro Div II lock — diagonal connectivity (#355)', () => {
  it('only center 3×3 nodes emit diagonal connections', () => {
    const { nodes } = createInitialState();
    for (const node of nodes.values()) {
      const diagonals = node.connections.filter((id) => {
        const m = id.match(/^n(\d+)-(\d+)$/);
        const self = node.id.match(/^n(\d+)-(\d+)$/);
        if (!m || !self) return false;
        const dr = Math.abs(Number(m[1]) - Number(self[1]));
        const dc = Math.abs(Number(m[2]) - Number(self[2]));
        return dr === 1 && dc === 1;
      });
      if (CENTER_3X3.includes(node.id)) {
        expect(diagonals).toHaveLength(4);
      } else {
        expect(diagonals).toHaveLength(0);
      }
    }
  });

  it('numbered start-row nodes have orthogonal neighbors only (no outbound diagonals)', () => {
    const { nodes } = createInitialState();
    for (const id of [
      'n0-0',
      'n0-1',
      'n0-2',
      'n0-3',
      'n0-4',
      'n4-0',
      'n4-1',
      'n4-2',
      'n4-3',
      'n4-4',
    ]) {
      const conns = nodes.get(id)!.connections;
      expect(conns.every((c) => !isDiagonalPair(id, c))).toBe(true);
    }
  });

  it('rim↔interior diagonals are one-way from the interior (engine asymmetry)', () => {
    const { nodes } = createInitialState();
    // Interior corner of 3×3 can step diagonally onto a numbered corner…
    expect(nodes.get('n1-1')!.connections).toContain('n0-0');
    // …but the numbered corner cannot step diagonally back.
    expect(nodes.get('n0-0')!.connections).not.toContain('n1-1');
    expect(getValidMoves(createInitialState(), 'p1-0')).not.toContain('n1-1');
  });

  it('center node has eight neighbors; side-edge midpoints have three orthogonal only', () => {
    const { nodes } = createInitialState();
    expect(nodes.get('n2-2')!.connections).toHaveLength(8);
    expect(nodes.get('n2-0')!.connections.sort()).toEqual([
      'n1-0',
      'n2-1',
      'n3-0',
    ]);
    expect(nodes.get('n0-2')!.connections.sort()).toEqual([
      'n0-1',
      'n0-3',
      'n1-2',
    ]);
  });
});

describe('Kwatro Div II lock — contiguous win scan vs official non-contiguous GOAL', () => {
  it('empty gap on a straight line stops the scan (contiguous engine behavior)', () => {
    // Official PDF: path "does not need to be contiguous".
    // Live engine: line walk breaks on empty → this arithmetic trio does NOT win.
    let state = createInitialState();
    state = placeAll(state, [
      ['p1-3', 'n1-0'], // Blue 6
      ['p2-1', 'n1-2'], // Red 3  (gap at n1-1)
      ['p1-1', 'n1-4'], // Blue 2  (gap at n1-3) → 6+2−3=5 if gaps allowed
      ['p1-0', 'n2-0'],
      ['p1-2', 'n2-1'],
      ['p1-4', 'n2-3'],
    ]);
    expect(allChipsOffNumbered(state.nodes, state.chips, 'player1')).toBe(true);
    expect(findWinningAlignment(state.nodes, 'n1-0')).toBeNull();
    expect(findWinningAlignment(state.nodes, 'n1-2')).toBeNull();
    expect(findWinningAlignment(state.nodes, 'n1-4')).toBeNull();
  });

  it('contiguous three-chip line with like+like−opposite=5 wins when chips are off numbers', () => {
    let state = createInitialState();
    state = placeAll(state, [
      ['p1-3', 'n2-0'], // 6
      ['p2-1', 'n2-1'], // 3
      ['p1-1', 'n1-2'], // 2 → move to n2-2
      ['p1-0', 'n1-0'],
      ['p1-2', 'n1-1'],
      ['p1-4', 'n1-3'],
    ]);
    const result = moveChip(selectChip(state, 'p1-1'), 'n2-2');
    expect(result.phase).toBe('gameOver');
    expect(result.winner).toBe('player1');
    expect(result.winningAlignment?.result).toBe(5);
    expect(
      result.winningAlignment?.chips.map((c) => c.value).sort((a, b) => a - b)
    ).toEqual([2, 3, 6]);
  });

  it('from a longer contiguous run, a winning trio subset is still accepted', () => {
    // PDF: "Only 3 chips can be on the winning path." Engine currently allows
    // checking every trio inside a contiguous run of length ≥ 3.
    let state = createInitialState();
    state = placeAll(state, [
      ['p1-3', 'n2-0'], // 6
      ['p2-1', 'n2-1'], // 3
      ['p1-1', 'n2-2'], // 2  → 6+2−3=5
      ['p2-0', 'n2-3'], // 1 (fourth chip on the same contiguous row)
      ['p1-0', 'n1-0'],
      ['p1-2', 'n1-1'],
      ['p1-4', 'n1-3'],
    ]);
    expect(allChipsOffNumbered(state.nodes, state.chips, 'player1')).toBe(true);
    const alignment = findWinningAlignment(state.nodes, 'n2-2');
    expect(alignment).not.toBeNull();
    expect(alignment!.result).toBe(5);
    expect(alignment!.nodes).toHaveLength(3);
  });
});

describe('Kwatro Div II lock — yellow middle absent on 5×5 model', () => {
  it('allows a contiguous horizontal win through geometric center n2-2', () => {
    // Official PDF: path "cannot cross the middle (yellow) area".
    // Live 5×5 model has no yellow node / no yellow filter — win through center OK.
    let state = createInitialState();
    state = placeAll(state, [
      ['p1-3', 'n2-0'], // 6
      ['p2-1', 'n2-1'], // 3
      ['p1-1', 'n2-2'], // 2
      ['p1-0', 'n1-0'],
      ['p1-2', 'n1-1'],
      ['p1-4', 'n1-3'],
    ]);
    const horiz = findWinningAlignment(state.nodes, 'n2-2');
    expect(horiz?.result).toBe(5);
    expect(horiz?.chips.map((c) => c.value).sort((a, b) => a - b)).toEqual([
      2, 3, 6,
    ]);
  });

  it('allows a contiguous diagonal win through geometric center n2-2', () => {
    let state = createInitialState();
    state = placeAll(state, [
      ['p1-3', 'n1-1'], // 6
      ['p2-1', 'n2-2'], // 3
      ['p1-1', 'n3-3'], // 2 → 6+2−3=5 on \
      ['p1-0', 'n1-0'],
      ['p1-2', 'n1-2'],
      ['p1-4', 'n1-3'],
    ]);
    const diag = findWinningAlignment(state.nodes, 'n2-2');
    expect(diag?.result).toBe(5);
    expect(diag?.chips.map((c) => c.value).sort((a, b) => a - b)).toEqual([
      2, 3, 6,
    ]);
  });
});

describe('Kwatro Div II lock — arithmetic trio helper', () => {
  it('accepts two same owner + one opposite totaling 4 or 5 only', () => {
    const stub = (owner: Player, value: number, id: string) => {
      const chip: Chip = {
        id,
        value,
        owner,
        position: id,
      };
      return {
        node: {
          id,
          x: 0,
          y: 0,
          isNumbered: false,
          chip,
          connections: [] as string[],
        },
        chip,
      };
    };
    expect(
      checkTrioForWin([
        stub('player1', 6, 'a'),
        stub('player1', 2, 'b'),
        stub('player2', 3, 'c'),
      ])?.result
    ).toBe(5);
    expect(
      checkTrioForWin([
        stub('player2', 9, 'a'),
        stub('player2', 1, 'b'),
        stub('player1', 6, 'c'),
      ])?.result
    ).toBe(4);
    // Three same color — rejected
    expect(
      checkTrioForWin([
        stub('player1', 8, 'a'),
        stub('player1', 2, 'b'),
        stub('player1', 4, 'c'),
      ])
    ).toBeNull();
    // Wrong total
    expect(
      checkTrioForWin([
        stub('player1', 8, 'a'),
        stub('player1', 2, 'b'),
        stub('player2', 1, 'c'),
      ])
    ).toBeNull();
  });
});

function isDiagonalPair(a: string, b: string): boolean {
  const ma = a.match(/^n(\d+)-(\d+)$/);
  const mb = b.match(/^n(\d+)-(\d+)$/);
  if (!ma || !mb) return false;
  return (
    Math.abs(Number(ma[1]) - Number(mb[1])) === 1 &&
    Math.abs(Number(ma[2]) - Number(mb[2])) === 1
  );
}
