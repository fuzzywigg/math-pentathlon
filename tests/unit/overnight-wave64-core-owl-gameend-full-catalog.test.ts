/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — game:end full catalog', () => {
  it('exposes win/loss/draw id set in stable order', () => {
    expect(
      owlMessages.getMessagesByCategory('game:end').map((m) => m.id).sort()
    ).toEqual([
      'draw-1',
      'draw-2',
      'loss-encouraging-1',
      'loss-encouraging-2',
      'loss-encouraging-3',
      'loss-encouraging-4',
      'loss-encouraging-5',
      'win-first-1',
      'win-generic-1',
      'win-generic-2',
      'win-generic-3',
      'win-generic-4',
      'win-generic-5',
      'win-streak-1',
    ]);
  });
});
