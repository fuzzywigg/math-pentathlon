/**
 * Wave 38 — findAllValidSets setSize 2/4 and mixed relationship rules.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { findAllValidSets, isValidSet } from '../../src/core/attributes/logic';
import {
  createPiece,
  type AttributePiece,
  type SetRule,
} from '../../src/core/attributes/types';

function card(
  id: string,
  color: string,
  shape: string,
  number: number
): AttributePiece {
  return createPiece(id, { color, shape, number });
}

const pool = [
  card('r1', 'red', 'circle', 1),
  card('r2', 'red', 'square', 2),
  card('r3', 'red', 'triangle', 3),
  card('b1', 'blue', 'circle', 1),
  card('b2', 'blue', 'square', 2),
  card('g1', 'green', 'circle', 3),
  card('g2', 'green', 'triangle', 2),
  card('y1', 'yellow', 'square', 1),
];

describe('Wave 38 attr-setSize — pairs and quads', () => {
  const colorSame: SetRule[] = [
    { attribute: 'color', relationship: 'all_same' },
    { attribute: 'shape', relationship: 'any' },
    { attribute: 'number', relationship: 'any' },
  ];

  it('setSize 2 finds all same-color pairs', () => {
    const pairs = findAllValidSets(pool, colorSame, 2);
    expect(pairs.length).toBeGreaterThan(0);
    for (const p of pairs) {
      expect(p).toHaveLength(2);
      expect(p[0].attributes.color).toBe(p[1].attributes.color);
      expect(isValidSet(p, colorSame)).toBe(true);
    }
    // red has 3 → C(3,2)=3 pairs; blue 1; green 1
    const redPairs = pairs.filter((p) => p[0].attributes.color === 'red');
    expect(redPairs).toHaveLength(3);
  });

  it('setSize 4 with all_different color needs 4 distinct colors', () => {
    const rules: SetRule[] = [
      { attribute: 'color', relationship: 'all_different' },
      { attribute: 'shape', relationship: 'any' },
      { attribute: 'number', relationship: 'any' },
    ];
    const quads = findAllValidSets(pool, rules, 4);
    for (const q of quads) {
      const colors = new Set(q.map((p) => p.attributes.color));
      expect(colors.size).toBe(4);
    }
    expect(quads.length).toBeGreaterThan(0);
  });

  it('empty pool / oversized setSize yields empty', () => {
    expect(findAllValidSets([], colorSame, 3)).toEqual([]);
    expect(findAllValidSets(pool, colorSame, 99)).toEqual([]);
  });
});
