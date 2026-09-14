/**
 * Overnight HEAVY leftover after #280 — stubNarrationFor kings-cell direct.
 * Distinct from wave57/58 DOM inspect kings leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { stubNarrationFor } from '../../src/core/owl';

describe('Wave 59 core owl — stub kings cell direct', () => {
  it('kings-cell stub includes row and column numbers', () => {
    const line = stubNarrationFor({
      kind: 'kings-cell',
      row: 3,
      col: 7,
    });
    expect(line).toMatch(/row 3/i);
    expect(line).toMatch(/column 7/i);
  });
});
