/**
 * Wave 49 — Kwatro selected chip valid dest fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidMoves } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — valid dest fill', () => {
  it('highlights valid destinations when chip selected', () => {
    const base = createInitialState();
    const chipId = [...base.chips.values()].find((c) => c.owner === 'player1')!.id;
    const moves = getValidMoves(base, chipId);
    expect(moves.length).toBeGreaterThan(0);
    const s = { ...base, selectedChip: chipId, phase: 'selectingDest' as const };
    const el = renderBoard(s, () => undefined, () => undefined);
    const dest = moves[0]!;
    const circle = el.querySelector(`[data-node-id="${dest}"] circle`)!;
    expect(circle.getAttribute('stroke')).toBe('#4caf50');
  });
});
