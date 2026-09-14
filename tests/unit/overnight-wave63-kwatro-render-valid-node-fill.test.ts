/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro valid-node fill palette.
 * Wave55/56 cover empty/numbered fills; deepen selectable destination green. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectChip } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 63 kwatro — valid-node fill', () => {
  it('valid destinations paint #c8e6c9 / #4caf50 / stroke 3', () => {
    const selected = selectChip(createInitialState(), 'p1-0');
    expect(selected.phase).toBe('selectingDest');
    const el = renderBoard(selected, () => undefined, () => undefined);
    const valid = el.querySelector('.kwa-valid-node');
    expect(valid).toBeTruthy();
    expect(valid?.getAttribute('fill')).toBe('#c8e6c9');
    expect(valid?.getAttribute('stroke')).toBe('#4caf50');
    expect(valid?.getAttribute('stroke-width')).toBe('3');
  });
});
