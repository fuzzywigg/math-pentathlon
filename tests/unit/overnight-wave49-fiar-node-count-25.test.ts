/**
 * Wave 49 — FIAR 5x5 node mount leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — node count', () => {
  it('mounts 25 data-node-id groups', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.querySelectorAll('[data-node-id]')).toHaveLength(25);
  });
});
