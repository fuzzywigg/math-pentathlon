/**
 * Wave 59 leftover after #276 — Hex-a-Gone exact placeBlocks remaining message. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  getPhaseMessage,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 59 hexagone — phase placing remaining exact', () => {
  it('exact Blue place remaining after commit triangle', () => {
    const placing = commitSelection(selectBlock(createInitialState(), 'triangle'));
    expect(getPhaseMessage(placing)).toBe('Blue: Place your blocks (1 remaining)');
  });
});
