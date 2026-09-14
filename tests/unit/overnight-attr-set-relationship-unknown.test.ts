/**
 * Overnight TOKENMAXX — checkSetRelationship unknown/default leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { checkSetRelationship } from '../../src/core/attributes/logic';
import type { AttributePiece } from '../../src/core/attributes/types';

describe('Overnight attr — set relationship default', () => {
  it('unknown relationship returns false', () => {
    const pieces: AttributePiece[] = [
      { id: '1', attributes: { color: 'r' } },
      { id: '2', attributes: { color: 'g' } },
    ];
    expect(checkSetRelationship(pieces, 'color', 'pair' as never)).toBe(false);
  });
});
