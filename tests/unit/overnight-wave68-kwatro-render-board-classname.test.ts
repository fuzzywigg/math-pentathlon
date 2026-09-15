/**
 * Wave 68 leftover after tip/#336 — Kwatro board container className.
 * Class soft-covered; deepen exact kwa-board leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 68 kwatro — render board classname', () => {
  it('renderBoard root uses class kwa-board', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    expect(el.className).toBe('kwa-board');
  });
});
