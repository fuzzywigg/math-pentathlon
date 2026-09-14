/**
 * Wave 49 — Par55 hand selected stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — hand selected', () => {
  it('adds selected class and orange stroke on selected block', () => {
    const base = createInitialState();
    const id = base.hands.player1[0]!.id;
    const s = { ...base, selectedBlock: id };
    const el = renderHand(s, 'player1', () => undefined);
    const selected = el.querySelector('.par55-hand-block.selected')!;
    expect(selected).toBeTruthy();
    const rect = selected.querySelector('rect')!;
    expect(rect.getAttribute('stroke')).toBe('#ff9800');
    expect(rect.getAttribute('stroke-width')).toBe('3');
  });
});
