// Tests for hex neighbor adjacency.
//
// The Hex game board uses a parallelogram (skewed-axial) layout where every
// row shifts right by hexWidth/2 uniformly. This means neighbor offsets are
// UNIFORM (no row-parity switching). Visually the board is a rhombus:
//
//   row 0:  0  1  2  3 ... (leftmost column)
//   row 1:   0  1  2  3 ...  (shifted half-hex right)
//   row 2:    0  1  2  3 ...
//
// Corner neighbor counts in this layout:
//   top-left  (0,0):        2  [right + lower-right]
//   top-right (0,N-1):      3  [left + lower-left + lower-right]
//   bot-left  (N-1,0):      3  [right + upper-left + upper-right]
//   bot-right (N-1,N-1):    2  [left + upper-left]
//
// Non-corner edge cells: 4 neighbors
// Interior cells:        6 neighbors

import { describe, it, expect } from 'vitest';
import { getNeighbors } from '../../src/games/hex/rules';

describe('Hex getNeighbors (parallelogram / skewed-axial coordinates)', () => {
  const BOARD = 11;

  // ---- Corner cells ----

  it('top-left corner (0,0) has 2 neighbors', () => {
    const n = getNeighbors({ row: 0, col: 0 }, BOARD);
    expect(n).toHaveLength(2);
    expect(n).toContainEqual({ row: 0, col: 1 });   // right
    expect(n).toContainEqual({ row: 1, col: 0 });   // lower-right
  });

  it('top-right corner (0, N-1) has 3 neighbors', () => {
    const n = getNeighbors({ row: 0, col: BOARD - 1 }, BOARD);
    expect(n).toHaveLength(3);
    expect(n).toContainEqual({ row: 0, col: BOARD - 2 });   // left
    expect(n).toContainEqual({ row: 1, col: BOARD - 2 });   // lower-left
    expect(n).toContainEqual({ row: 1, col: BOARD - 1 });   // lower-right
  });

  it('bot-left corner (N-1, 0) has 3 neighbors', () => {
    const n = getNeighbors({ row: BOARD - 1, col: 0 }, BOARD);
    expect(n).toHaveLength(3);
    expect(n).toContainEqual({ row: BOARD - 2, col: 0 });   // upper-left
    expect(n).toContainEqual({ row: BOARD - 2, col: 1 });   // upper-right
    expect(n).toContainEqual({ row: BOARD - 1, col: 1 });   // right
  });

  it('bot-right corner (N-1, N-1) has 2 neighbors', () => {
    const n = getNeighbors({ row: BOARD - 1, col: BOARD - 1 }, BOARD);
    expect(n).toHaveLength(2);
    expect(n).toContainEqual({ row: BOARD - 2, col: BOARD - 1 }); // upper-right (lower-right relative)
    expect(n).toContainEqual({ row: BOARD - 1, col: BOARD - 2 }); // left
  });

  // ---- Non-corner edge cells ----

  it('top-edge non-corner (0, 5) has 4 neighbors', () => {
    const n = getNeighbors({ row: 0, col: 5 }, BOARD);
    expect(n).toHaveLength(4);
  });

  it('bottom-edge non-corner (N-1, 5) has 4 neighbors', () => {
    const n = getNeighbors({ row: BOARD - 1, col: 5 }, BOARD);
    expect(n).toHaveLength(4);
  });

  it('left-edge non-corner (5, 0) has 4 neighbors', () => {
    const n = getNeighbors({ row: 5, col: 0 }, BOARD);
    expect(n).toHaveLength(4);
  });

  it('right-edge non-corner (5, N-1) has 4 neighbors', () => {
    const n = getNeighbors({ row: 5, col: BOARD - 1 }, BOARD);
    expect(n).toHaveLength(4);
  });

  // ---- Interior cells ----

  it('center cell (5, 5) has 6 neighbors', () => {
    const n = getNeighbors({ row: 5, col: 5 }, BOARD);
    expect(n).toHaveLength(6);
  });

  it('interior cell (4, 5) has correct 6 neighbor positions', () => {
    const n = getNeighbors({ row: 4, col: 5 }, BOARD);
    expect(n).toHaveLength(6);
    expect(n).toContainEqual({ row: 3, col: 5 }); // upper-left
    expect(n).toContainEqual({ row: 3, col: 6 }); // upper-right
    expect(n).toContainEqual({ row: 4, col: 4 }); // left
    expect(n).toContainEqual({ row: 4, col: 6 }); // right
    expect(n).toContainEqual({ row: 5, col: 4 }); // lower-left
    expect(n).toContainEqual({ row: 5, col: 5 }); // lower-right
  });

  it('offsets are UNIFORM (no row-parity switching)', () => {
    // In a parallelogram layout every interior cell must have the same 6 offset pattern
    const evenCenter = getNeighbors({ row: 4, col: 5 }, BOARD);
    const oddCenter  = getNeighbors({ row: 5, col: 5 }, BOARD);
    // Both must be size 6
    expect(evenCenter).toHaveLength(6);
    expect(oddCenter).toHaveLength(6);
    // The offsets should be symmetric: (row,col) and (row+1, col+1) must both be 6-neighbor interior cells
    // and share a neighbor
    const shared = evenCenter.filter((a) =>
      oddCenter.some((b) => b.row === a.row && b.col === a.col)
    );
    expect(shared.length).toBeGreaterThanOrEqual(2);
  });

  // ---- Invariants ----

  it('all returned neighbors are within board bounds', () => {
    for (let row = 0; row < BOARD; row++) {
      for (let col = 0; col < BOARD; col++) {
        const neighbors = getNeighbors({ row, col }, BOARD);
        for (const n of neighbors) {
          expect(n.row).toBeGreaterThanOrEqual(0);
          expect(n.row).toBeLessThan(BOARD);
          expect(n.col).toBeGreaterThanOrEqual(0);
          expect(n.col).toBeLessThan(BOARD);
        }
      }
    }
  });

  it('neighbor relationship is symmetric: if B is neighbor of A then A is neighbor of B', () => {
    for (let row = 0; row < BOARD; row++) {
      for (let col = 0; col < BOARD; col++) {
        const neighbors = getNeighbors({ row, col }, BOARD);
        for (const n of neighbors) {
          const reverseNeighbors = getNeighbors(n, BOARD);
          const found = reverseNeighbors.some((rn) => rn.row === row && rn.col === col);
          expect(found).toBe(true);
        }
      }
    }
  });

  it('straight vertical chain connects top-to-bottom on 5x5 board', () => {
    // Verifies win-path adjacency: each consecutive pair in a vertical column must be neighbors
    const chain = [0, 1, 2, 3, 4].map((r) => ({ row: r, col: 2 }));
    for (let i = 0; i < chain.length - 1; i++) {
      const neighbors = getNeighbors(chain[i], 5);
      const connected = neighbors.some((n) => n.row === chain[i + 1].row && n.col === chain[i + 1].col);
      expect(connected).toBe(true);
    }
  });

  it('straight horizontal chain connects left-to-right on 5x5 board', () => {
    const chain = [0, 1, 2, 3, 4].map((c) => ({ row: 2, col: c }));
    for (let i = 0; i < chain.length - 1; i++) {
      const neighbors = getNeighbors(chain[i], 5);
      const connected = neighbors.some((n) => n.row === chain[i + 1].row && n.col === chain[i + 1].col);
      expect(connected).toBe(true);
    }
  });
});
