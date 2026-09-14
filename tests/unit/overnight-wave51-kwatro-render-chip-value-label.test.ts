/**
 * Wave 51 leftover after #233 — Kwatro chip value label. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 51 kwatro — chip value label', () => {
  it('renders chip value text on board nodes', () => {
    const state = createInitialState();
    const chip = [...state.chips.values()][0];
    const el = renderBoard(state, () => undefined, () => undefined);
    const texts = [...el.querySelectorAll('text')].map((t) => t.textContent);
    expect(texts).toContain(String(chip.value));
  });
});
