/**
 * Wave 45 — Star Track getPhaseMessage Red on selectChain
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getPhaseMessage } from '../../src/games/star-track/rules';

describe('Wave 45 Star — phase message Red select', () => {
  it('names Red when player2 is selecting', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 2 as const, id: 1 },
        { length: 3 as const, id: 2 },
      ],
    };
    expect(getPhaseMessage(state)).toMatch(/Red/);
    expect(getPhaseMessage(state)).toMatch(/Choose a chain/i);
  });
});
