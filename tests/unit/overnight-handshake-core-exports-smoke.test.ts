/**
 * Overnight TOKENMAXX — core export smoke handshake leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { cubeRound, reflect } from '../../src/core/hex/coordinates';
import { filterPieces, createMathPiece } from '../../src/core/attributes/logic';
import { clearSelection, rollMultiple } from '../../src/core/dice/roller';
import { findComponents } from '../../src/core/graph/algorithms';
import { CONFIG } from '../../src/games/fab-a-diffy/types';
import type { Graph } from '../../src/core/graph/types';

describe('Overnight handshake — export smoke', () => {
  it('modules answer without throwing', () => {
    expect(cubeRound({ x: 0.2, y: 0.2, z: -0.4 }).x + cubeRound({ x: 0.2, y: 0.2, z: -0.4 }).y + cubeRound({ x: 0.2, y: 0.2, z: -0.4 }).z).toBe(0);
    expect(reflect({ q: 1, r: 0 }, 'q').q).toBe(1);
    expect(createMathPiece(4).attributes.isSquare).toBe(true);
    expect(filterPieces([createMathPiece(3)], { attribute: 'isPrime', operator: 'equals', value: true })).toHaveLength(1);
    const rolled = rollMultiple('d6', 2);
    expect(clearSelection(rolled).rolls.every((d) => !d.isSelected)).toBe(true);
    const g: Graph = {
      nodes: new Map([['n', { id: 'n', position: { x: 0, y: 0 } }]]),
      edges: [],
      directed: false,
    };
    expect(findComponents(g)).toHaveLength(1);
    expect(CONFIG.TOTAL_ROUNDS).toBeGreaterThan(0);
  });
});
