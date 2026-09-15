/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone mount .hex-a-gone-wrapper. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 65 hexagone — mount wrapper', () => {
  it('mounts .hex-a-gone-wrapper', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el, undefined, undefined, () => {});
    expect(el.querySelectorAll('.hex-a-gone-wrapper')).toHaveLength(1);
  });
});
