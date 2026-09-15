/**
 * Wave 68 leftover after tip/#336 — Kwatro valid node stroke #4caf50 width 3.
 * Wave63 fill; deepen stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 68 kwatro — render valid node stroke 3', () => {
  it('valid destination uses stroke #4caf50 width 3', () => {
    const selected = selectChip(createInitialState(), 'p1-0');
    const el = renderBoard(selected, () => undefined, () => undefined);
    const valid = el.querySelector('.kwa-valid-node');
    expect(valid?.getAttribute('stroke')).toBe('#4caf50');
    expect(valid?.getAttribute('stroke-width')).toBe('3');
    expect(valid?.getAttribute('fill')).toBe('#c8e6c9');
  });
});
