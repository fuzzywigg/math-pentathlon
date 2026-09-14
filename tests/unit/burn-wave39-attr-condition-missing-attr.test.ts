/**
 * Wave 39 — evaluateCondition missing attribute leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  evaluateCondition,
  matchesPiece,
  getMatchDetails,
} from '../../src/core/attributes';
import type { AttributePiece } from '../../src/core/attributes';

describe('Wave 39 attr — missing attribute condition', () => {
  const piece: AttributePiece = {
    id: 'p1',
    attributes: { color: 'red', size: 2 },
  };

  it('missing attribute yields false', () => {
    expect(
      evaluateCondition(piece, {
        attribute: 'shape',
        operator: 'equals',
        value: 'circle',
      })
    ).toBe(false);
  });

  it('present attribute evaluates', () => {
    expect(
      evaluateCondition(piece, {
        attribute: 'color',
        operator: 'equals',
        value: 'red',
      })
    ).toBe(true);
  });

  it('getMatchDetails splits matched/unmatched', () => {
    const details = getMatchDetails(piece, [
      { attribute: 'color', operator: 'equals', value: 'red' },
      { attribute: 'shape', operator: 'equals', value: 'circle' },
    ]);
    expect(details.matches).toBe(false);
    expect(details.matchedAttributes).toEqual(['color']);
    expect(details.unmatchedAttributes).toEqual(['shape']);
  });

  it('matchesPiece delegates to evaluateCondition', () => {
    expect(
      matchesPiece(piece, {
        attribute: 'size',
        operator: 'greater_than',
        value: 1,
      })
    ).toBe(true);
  });
});
