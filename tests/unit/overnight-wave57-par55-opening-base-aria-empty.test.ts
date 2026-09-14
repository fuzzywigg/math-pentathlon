/**
 * Wave 57 leftover after #263 — Par 55 empty base aria + data-base-id. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderBoard } from '../../src/games/par-55/board-ui';

describe('Wave 57 par55 — base aria', () => {
  it('empty mid base has row,col empty aria and data-base-id', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const mid = el.querySelector('[data-row="2"][data-col="2"]');
    expect(mid?.getAttribute('data-base-id')).toBeTruthy();
    expect(mid?.getAttribute('aria-label')).toBe('2,2, empty');
  });
});
