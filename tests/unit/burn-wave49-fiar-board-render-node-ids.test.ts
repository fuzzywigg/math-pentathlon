/**
 * Wave 49 — FIAR renderBoard node ids leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — renderBoard nodes', () => {
  it('emits data-node-id for every board node', () => {
    const s = createInitialState();
    const svg = renderBoard(s, () => undefined);
    const ids = [...svg.querySelectorAll('[data-node-id]')].map((el) =>
      el.getAttribute('data-node-id')
    );
    expect(ids.length).toBe(s.board.nodes.size);
    expect(ids).toContain('0-0');
    expect(new Set(ids).size).toBe(ids.length);
  });
});
