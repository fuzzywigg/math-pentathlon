/**
 * Wave 45 — Star Track unused recycle preserves chain length and id
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { selectChain } from '../../src/games/star-track/rules';

describe('Wave 45 Star — recycle unused length', () => {
  it('puts unused chain id+length back on index 0 pick', () => {
    const unused = { length: 5 as const, id: 22 };
    const used = { length: 2 as const, id: 21 };
    const state = {
      ...createInitialState(),
      chainBucket: [{ length: 1 as const, id: 0 }],
      phase: 'selectChain' as const,
      drawnChains: [used, unused] as [
        { length: 2; id: number },
        { length: 5; id: number },
      ],
      currentPlayer: 'player1' as const,
    };
    const next = selectChain(state, 0);
    expect(next.chainBucket.some((c) => c.id === unused.id && c.length === 5)).toBe(true);
    expect(next.selectedChain?.id).toBe(used.id);
  });
});
