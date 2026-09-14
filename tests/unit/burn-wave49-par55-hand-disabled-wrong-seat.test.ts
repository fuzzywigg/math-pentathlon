/**
 * Wave 49 — Par55 hand disabled wrong seat leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — hand wrong seat', () => {
  it('disables opponent hand while p1 selecting', () => {
    const s = createInitialState();
    const el = renderHand(s, 'player2', () => undefined);
    const blocks = [...el.querySelectorAll('.par55-hand-block')];
    expect(blocks.every((b) => !b.classList.contains('clickable'))).toBe(true);
    expect(blocks.every((b) => b.getAttribute('aria-disabled') === 'true')).toBe(true);
    expect(blocks.every((b) => b.getAttribute('tabindex') === '-1')).toBe(true);
  });
});
