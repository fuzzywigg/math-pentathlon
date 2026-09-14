/** Wave 42 — Remainder previewDivision null without roll. Tests-only. */
import { describe, it, expect } from 'vitest';

import {
  previewDivision,
  calculateDivision,
} from '../../src/games/remainder-islands/rules';
import { createInitialState } from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — preview null roll', () => {
  it('previewDivision null when currentRoll is null', () => {
    const state = createInitialState();
    expect(state.currentRoll).toBeNull();
    expect(previewDivision(state, state.islands[0].id)).toBeNull();
  });

  it('previewDivision null for unknown island even with roll', () => {
    const state = {
      ...createInitialState(),
      currentRoll: { die1: 2, die2: 4, total: 6 },
    };
    expect(previewDivision(state, 'no-island')).toBeNull();
  });

  it('previewDivision returns division when roll + island exist', () => {
    const state = createInitialState();
    const island = state.islands[0];
    const rolled = {
      ...state,
      currentRoll: { die1: 6, die2: 5, total: 11 },
    };
    expect(previewDivision(rolled, island.id)).toEqual(
      calculateDivision(11, island.value)
    );
  });

  it('clearing roll after preview path yields null again', () => {
    const state = createInitialState();
    const island = state.islands[0];
    const withRoll = {
      ...state,
      currentRoll: { die1: 1, die2: 1, total: 2 },
    };
    expect(previewDivision(withRoll, island.id)).not.toBeNull();
    const cleared = { ...withRoll, currentRoll: null };
    expect(previewDivision(cleared, island.id)).toBeNull();
  });
});
