/**
 * Wave 68 leftover after tip/#336 — Kwatro chip circle stroke #333 width 2.
 * Radii covered; deepen chip stroke leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 68 kwatro — render chip stroke 333', () => {
  it('chip circle uses stroke #333 width 2', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const chipNode = el.querySelector('[data-node-id="n0-0"]');
    const chipCircle = [...(chipNode?.querySelectorAll('circle') ?? [])].find(
      (c) => c.getAttribute('stroke') === '#333'
    );
    expect(chipCircle).toBeTruthy();
    expect(chipCircle?.getAttribute('stroke-width')).toBe('2');
  });
});
