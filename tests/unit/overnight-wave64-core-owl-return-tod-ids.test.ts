/**
 * Overnight TOKENMAXX HEAVY leftovers after #304 — Owl MESSAGE_LIBRARY residual.
 * Tip alpha after #302/#303/#304/#305/#306. Unit-only. No invent-product.
 */

import { describe, it, expect } from 'vitest';
import { owlMessages } from '../../src/core/owl';

describe('Wave 64 core owl — return time-of-day ids', () => {
  it('app:return exposes morning/afternoon/evening/night conditioned rows', () => {
    const byId = Object.fromEntries(
      owlMessages.getMessagesByCategory('app:return').map((m) => [m.id, m])
    );
    expect(byId['return-morning-1'].conditions).toEqual([
      { type: 'timeOfDay', value: 'morning' },
    ]);
    expect(byId['return-afternoon-1'].conditions).toEqual([
      { type: 'timeOfDay', value: 'afternoon' },
    ]);
    expect(byId['return-evening-1'].conditions).toEqual([
      { type: 'timeOfDay', value: 'evening' },
    ]);
    expect(byId['return-night-1'].conditions).toEqual([
      { type: 'timeOfDay', value: 'night' },
    ]);
  });
});
