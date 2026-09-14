/**
 * Wave 43 — Hex-a-Gone phase messages for Red seat. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/hex-a-gone/types';
import { getPhaseMessage, selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hex-a-gone — phase message p2', () => {
  it('player2 messages use Red label', () => {
    const s = { ...createInitialState(), currentPlayer: 'player2' as const };
    expect(getPhaseMessage(s)).toMatch(/Red/);
    const place = commitSelection(selectBlock(s, 'square'));
    expect(getPhaseMessage(place)).toMatch(/Red/);
    expect(getPhaseMessage({ ...s, phase: 'gameOver', winner: 'player2' })).toMatch(/Red wins/);
  });
});
