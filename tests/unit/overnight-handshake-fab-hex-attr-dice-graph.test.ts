/**
 * Overnight TOKENMAXX — handshake leftovers across fab/hex/attr/dice/graph. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, hasAnyValidMove } from '../../src/games/fab-a-diffy/rules';
import { hexSpiral, hexDistance } from '../../src/core/hex/coordinates';
import { createAxial } from '../../src/core/hex/types';
import { createMathPiece, isPrime } from '../../src/core/attributes/logic';
import { getAllPossibleSums, roll } from '../../src/core/dice/roller';
import { bfs, isConnected } from '../../src/core/graph/algorithms';
import type { Graph } from '../../src/core/graph/types';

describe('Overnight handshake — core leftovers coexist', () => {
  it('fab opening has valid moves; hex spiral distances ok', () => {
    expect(hasAnyValidMove(createInitialState())).toBe(true);
    const c = createAxial(0, 0);
    expect(hexSpiral(c, 2).every((h) => hexDistance(c, h) <= 2)).toBe(true);
  });

  it('math piece primes align with isPrime; dice sums non-empty', () => {
    expect(createMathPiece(7).attributes.isPrime).toBe(isPrime(7));
    expect(getAllPossibleSums([2, 5]).length).toBeGreaterThan(0);
    expect(roll('d6').rolls).toHaveLength(1);
  });

  it('tiny connected graph BFS works', () => {
    const g: Graph = {
      nodes: new Map([
        ['a', { id: 'a', position: { x: 0, y: 0 } }],
        ['b', { id: 'b', position: { x: 0, y: 0 } }],
      ]),
      edges: [{ from: 'a', to: 'b', weight: 1 }],
      directed: false,
    };
    expect(isConnected(g)).toBe(true);
    expect(bfs(g, 'a', 'b').found).toBe(true);
  });
});
