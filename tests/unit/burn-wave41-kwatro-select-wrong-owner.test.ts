/**
 * Wave 41 — Kwatro-Sinko selectChip wrong-owner / missing identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectChip,
  getValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import type { Chip, KwaState } from '../../src/games/kwatro-sinko/types';

describe('Wave 41 kwatro-sinko — select wrong owner', () => {
  it('identity for missing chip id', () => {
    const state = createInitialState();
    expect(selectChip(state, 'no-such-chip')).toBe(state);
  });

  it('identity for opponent chip', () => {
    const state = createInitialState();
    expect(selectChip(state, 'p2-0')).toBe(state);
    expect(selectChip(state, 'p2-4')).toBe(state);
  });

  it('identity when phase is selectingDest / gameOver', () => {
    const base = createInitialState();
    const dest: KwaState = {
      ...base,
      phase: 'selectingDest',
      selectedChip: 'p1-0',
    };
    expect(selectChip(dest, 'p1-1')).toBe(dest);
    const over: KwaState = {
      ...base,
      phase: 'gameOver',
      winner: 'player1',
    };
    expect(selectChip(over, 'p1-0')).toBe(over);
  });

  it('identity when chip has null position or zero valid moves', () => {
    const state = createInitialState();
    const chips = new Map(state.chips);
    const floating: Chip = {
      id: 'float',
      value: 2,
      owner: 'player1',
      position: null,
    };
    chips.set('float', floating);
    const floated: KwaState = { ...state, chips };
    expect(selectChip(floated, 'float')).toBe(floated);
    expect(getValidMoves(floated, 'float')).toEqual([]);
  });
});
