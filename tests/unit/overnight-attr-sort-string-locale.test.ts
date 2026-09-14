/**
 * Overnight TOKENMAXX — sortByAttribute string locale leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sortByAttribute } from '../../src/core/attributes/logic';
import type { AttributePiece } from '../../src/core/attributes/types';

describe('Overnight attr — string sort', () => {
  it('sorts string attributes ascending', () => {
    const pieces: AttributePiece[] = [
      { id: 'a', attributes: { name: 'zeta' } },
      { id: 'b', attributes: { name: 'alpha' } },
      { id: 'c', attributes: { name: 'mu' } },
    ];
    expect(sortByAttribute(pieces, 'name').map((p) => p.id)).toEqual(['b', 'c', 'a']);
  });
});
