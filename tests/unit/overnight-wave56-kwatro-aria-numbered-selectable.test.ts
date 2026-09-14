/**
 * Wave 56 leftover after #256 — Kwatro opening chip aria numbered+selectable. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 56 kwatro — chip aria', () => {
  it('P1 chip node includes numbered + selectable; mid empty numbered absent', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const p1 = el.querySelector('[data-node-id="n0-0"]')?.getAttribute('aria-label') ?? '';
    expect(p1).toMatch(/numbered/);
    expect(p1).toMatch(/selectable/);
    const mid = el.querySelector('[data-node-id="n2-2"]')?.getAttribute('aria-label') ?? '';
    expect(mid).toBe('2,2, empty');
  });
});
