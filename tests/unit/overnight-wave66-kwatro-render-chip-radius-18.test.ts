/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro chip circle radius 18.
 * Wave51 locks value label; deepen chip circle r=18 + stroke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 66 kwatro — render chip radius 18', () => {
  it('opening chip circle has r=18 and #333 stroke', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const circles = [
      ...(el.querySelector('[data-node-id="n0-0"]')?.querySelectorAll('circle') ?? []),
    ];
    const chip = circles.find((c) => c.getAttribute('r') === '18');
    expect(chip).toBeTruthy();
    expect(chip?.getAttribute('stroke')).toBe('#333');
    expect(chip?.getAttribute('stroke-width')).toBe('2');
  });
});
