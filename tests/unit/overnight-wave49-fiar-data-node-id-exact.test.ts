/**
 * Wave 49 — FIAR data-node-id grid key leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — data-node-id', () => {
  it('mounts corner node 0-0', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.querySelector('[data-node-id="0-0"]')).toBeTruthy();
  });
});
