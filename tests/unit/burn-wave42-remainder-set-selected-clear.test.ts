/** Wave 42 — Remainder setSelectedIsland set and clear. Tests-only. */
import { describe, it, expect } from 'vitest';

import { setSelectedIsland } from '../../src/games/remainder-islands/rules';
import { createInitialState } from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — setSelected clear', () => {
  it('setSelectedIsland stores island id', () => {
    const state = createInitialState();
    const id = state.islands[0].id;
    const next = setSelectedIsland(state, id);
    expect(next.selectedIsland).toBe(id);
    expect(next).not.toBe(state);
  });

  it('setSelectedIsland null clears preview', () => {
    const state = setSelectedIsland(createInitialState(), 'island-1-2');
    expect(state.selectedIsland).toBe('island-1-2');
    const cleared = setSelectedIsland(state, null);
    expect(cleared.selectedIsland).toBeNull();
  });

  it('clear does not alter scores chips or islands', () => {
    const base = createInitialState();
    const selected = setSelectedIsland(base, base.islands[3].id);
    const cleared = setSelectedIsland(selected, null);
    expect(cleared.islands).toEqual(base.islands);
    expect(cleared.player1Score).toBe(base.player1Score);
    expect(cleared.player2Chips).toBe(base.player2Chips);
    expect(cleared.phase).toBe(base.phase);
  });

  it('overwrite selection replaces prior id', () => {
    const base = createInitialState();
    const a = base.islands[0].id;
    const b = base.islands[1].id;
    const first = setSelectedIsland(base, a);
    const second = setSelectedIsland(first, b);
    expect(second.selectedIsland).toBe(b);
  });

  it('clear when already null stays null', () => {
    const state = createInitialState();
    expect(state.selectedIsland).toBeNull();
    expect(setSelectedIsland(state, null).selectedIsland).toBeNull();
  });
});
