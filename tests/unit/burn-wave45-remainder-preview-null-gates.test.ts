/**
 * Wave 45 TOKENMAXX — Remainder previewDivision null gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { previewDivision } from '../../src/games/remainder-islands/rules';

describe('Wave 45 remainder — preview nulls', () => {
  it('null without roll or missing island', () => {
    const open = createInitialState();
    expect(previewDivision(open, open.islands[0].id)).toBeNull();
    const rolling = {
      ...open,
      currentRoll: { die1: 1, die2: 1, total: 2 },
    };
    expect(previewDivision(rolling, 'no-such-island')).toBeNull();
    const ok = previewDivision(rolling, open.islands[0].id);
    expect(ok?.dividend).toBe(2);
    expect(ok?.divisor).toBe(open.islands[0].value);
  });
});
