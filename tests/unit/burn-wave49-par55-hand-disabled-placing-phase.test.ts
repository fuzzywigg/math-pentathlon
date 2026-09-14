/**
 * Wave 49 — Par55 hand disabled in placingBlock leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — hand placing phase', () => {
  it('disables current hand when phase is placingBlock', () => {
    const base = createInitialState();
    const s = { ...base, phase: 'placingBlock' as const, selectedBlock: base.hands.player1[0]!.id };
    const el = renderHand(s, 'player1', () => undefined);
    const blocks = [...el.querySelectorAll('.par55-hand-block')];
    expect(blocks.every((b) => !b.classList.contains('clickable'))).toBe(true);
    expect(blocks.every((b) => b.getAttribute('aria-disabled') === 'true')).toBe(true);
  });
});
