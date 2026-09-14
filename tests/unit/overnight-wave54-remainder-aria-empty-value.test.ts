/**
 * Overnight HEAVY leftover after #241 — empty island aria includes value. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — aria empty value', () => {
  it('unclaimed group aria-label has empty + value N', () => {
    const s = createInitialState();
    const island = s.islands[0]!;
    const svg = renderBoard(s, () => undefined, () => undefined);
    const label = svg.querySelector(`[data-island-id="${island.id}"]`)?.getAttribute('aria-label') ?? '';
    expect(label).toContain('empty');
    expect(label).toContain(`value ${island.value}`);
    expect(label).toContain(`${island.row},${island.col}`);
  });
});
