/**
 * Wave 67 leftover after tip/#324 — Kwatro chip circle stroke #333 / width 2.
 * Soft fill seats existed; deepen chip stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 67 kwatro — render chip stroke 333', () => {
  it('chip circle strokes #333 width 2 with r 18', () => {
    const state = createInitialState();
    const chip = [...state.chips.values()].find((c) => c.owner === 'player1')!;
    const el = renderBoard(state, () => undefined, () => undefined);
    const node = el.querySelector(`[data-node-id="${chip.position}"]`);
    const chipCircle = [...(node?.querySelectorAll('circle') ?? [])].find(
      (c) => c.getAttribute('r') === '18'
    );
    expect(chipCircle?.getAttribute('stroke')).toBe('#333');
    expect(chipCircle?.getAttribute('stroke-width')).toBe('2');
  });
});
