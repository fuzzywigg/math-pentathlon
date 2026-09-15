/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro select ring radius 22.
 * Wave51 locks #ff9800 stroke; deepen ring r = CHIP_RADIUS+4. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 66 kwatro — render select ring radius 22', () => {
  it('selected chip ring has r=22', () => {
    const base = createInitialState();
    const chip = [...base.chips.values()].find((c) => c.owner === 'player1')!;
    const state = { ...base, selectedChip: chip.id };
    const el = renderBoard(state, () => undefined, () => undefined);
    const node = el.querySelector(`[data-node-id="${chip.position}"]`);
    const ring = [...(node?.querySelectorAll('circle') ?? [])].find(
      (c) =>
        c.getAttribute('stroke') === '#ff9800' && c.getAttribute('fill') === 'none'
    );
    expect(ring?.getAttribute('r')).toBe('22');
  });
});
