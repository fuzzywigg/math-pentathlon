/**
 * Overnight HEAVY leftovers after #234 — Kwatro selectable chip class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 51 kwatro — selectable chip', () => {
  it('marks current player chips with kwa-selectable-chip on opening', () => {
    const state = createInitialState();
    const el = renderBoard(state, () => undefined, () => undefined);
    expect(el.querySelectorAll('.kwa-selectable-chip').length).toBeGreaterThan(0);
  });
});
