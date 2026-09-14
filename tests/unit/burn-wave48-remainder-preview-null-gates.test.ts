/**
 * Wave 48 — Remainder previewDivision null gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { previewDivision, setSelectedIsland } from '../../src/games/remainder-islands/rules';

describe('Wave 48 remainder — preview null', () => {
  it('null without roll or ghost island; setSelectedIsland stamps id', () => {
    const s = createInitialState();
    expect(previewDivision(s, s.islands[0].id)).toBeNull();
    const rolled = { ...s, currentRoll: { die1: 2, die2: 2, total: 4 } };
    expect(previewDivision(rolled, 'ghost-island')).toBeNull();
    const prev = previewDivision(rolled, s.islands[0].id);
    expect(prev).not.toBeNull();
    expect(prev!.dividend).toBe(4);
    expect(setSelectedIsland(s, 'x').selectedIsland).toBe('x');
  });
});
