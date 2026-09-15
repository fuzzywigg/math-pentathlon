/**
 * Wave 65 leftover after tip/#313 — Hex mount .hex-edge.hex-edge-p1. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

describe('Wave 65 hex — mount edge-p1 class', () => {
  it('mounts two .hex-edge.hex-edge-p1', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(5), el);
    expect(el.querySelectorAll('.hex-edge.hex-edge-p1')).toHaveLength(2);
  });
});
