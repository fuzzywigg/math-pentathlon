/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — game:start full catalog', () => {
  it('exposes first/return/generic eight ids', () => {
    expect(
      owlMessages.getMessagesByCategory('game:start').map((m) => m.id).sort()
    ).toEqual([
      'game-start-first-1',
      'game-start-first-2',
      'game-start-generic-1',
      'game-start-generic-2',
      'game-start-generic-3',
      'game-start-generic-4',
      'game-start-return-1',
      'game-start-return-2',
    ]);
  });
});
