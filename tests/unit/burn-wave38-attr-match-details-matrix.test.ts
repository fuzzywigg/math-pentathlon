/**
 * Wave 38 — getMatchDetails / matchesPiece / filterPieces cartesian stress.
 * Distinct from wave 29 attr-match-filter. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getMatchDetails,
  matchesPiece,
  filterPieces,
  evaluateCondition,
} from '../../src/core/attributes/logic';
import {
  createPiece,
  type AttributeCondition,
  type ComparisonOperator,
} from '../../src/core/attributes/types';

const ops: ComparisonOperator[] = [
  'equals',
  'not_equals',
  'greater_than',
  'less_than',
  'greater_equal',
  'less_equal',
];

describe('Wave 38 attr-match — getMatchDetails full condition lists', () => {
  const piece = createPiece('p', { a: 5, b: 'red', c: true });

  it('all-pass vs mixed unmatchedAttributes order preserved', () => {
    const conditions: AttributeCondition[] = [
      { attribute: 'a', operator: 'equals', value: 5 },
      { attribute: 'b', operator: 'equals', value: 'red' },
      { attribute: 'c', operator: 'equals', value: true },
    ];
    const ok = getMatchDetails(piece, conditions);
    expect(ok.matches).toBe(true);
    expect(ok.matchedAttributes).toEqual(['a', 'b', 'c']);
    expect(ok.unmatchedAttributes).toEqual([]);

    const mixed: AttributeCondition[] = [
      { attribute: 'a', operator: 'greater_than', value: 10 },
      { attribute: 'b', operator: 'equals', value: 'red' },
      { attribute: 'missing', operator: 'equals', value: 1 },
      { attribute: 'c', operator: 'not_equals', value: false },
    ];
    const bad = getMatchDetails(piece, mixed);
    expect(bad.matches).toBe(false);
    expect(bad.matchedAttributes).toEqual(['b', 'c']);
    expect(bad.unmatchedAttributes).toEqual(['a', 'missing']);
  });

  it('numeric operator matrix against a=5', () => {
    const targets = [3, 5, 7];
    for (const op of ops) {
      for (const t of targets) {
        const cond: AttributeCondition = {
          attribute: 'a',
          operator: op,
          value: t,
        };
        const details = getMatchDetails(piece, [cond]);
        const expected = evaluateCondition(piece, cond);
        expect(details.matches).toBe(expected);
        if (expected) expect(details.matchedAttributes).toEqual(['a']);
        else expect(details.unmatchedAttributes).toEqual(['a']);
      }
    }
  });
});

describe('Wave 38 attr-filter — dense bag filtering', () => {
  const bag = Array.from({ length: 30 }, (_, i) =>
    createPiece(`n${i}`, {
      value: i,
      parity: i % 2 === 0 ? 'even' : 'odd',
      band: i < 10 ? 'low' : i < 20 ? 'mid' : 'high',
    })
  );

  it('filterPieces equals parity splits evenly', () => {
    const even = filterPieces(bag, {
      attribute: 'parity',
      operator: 'equals',
      value: 'even',
    });
    expect(even).toHaveLength(15);
    expect(even.every((p) => p.attributes.parity === 'even')).toBe(true);
  });

  it('compound and/or over band × value', () => {
    const midHigh = filterPieces(bag, {
      operator: 'and',
      conditions: [
        {
          operator: 'or',
          conditions: [
            { attribute: 'band', operator: 'equals', value: 'mid' },
            { attribute: 'band', operator: 'equals', value: 'high' },
          ],
        },
        { attribute: 'value', operator: 'greater_equal', value: 15 },
      ],
    });
    expect(midHigh.every((p) => (p.attributes.value as number) >= 15)).toBe(
      true
    );
    expect(midHigh.every((p) => p.attributes.band !== 'low')).toBe(true);
  });

  it('matchesPiece single vs compound agree with filter', () => {
    const cond: AttributeCondition = {
      attribute: 'band',
      operator: 'equals',
      value: 'low',
    };
    for (const p of bag) {
      expect(matchesPiece(p, cond)).toBe(p.attributes.band === 'low');
    }
  });
});
