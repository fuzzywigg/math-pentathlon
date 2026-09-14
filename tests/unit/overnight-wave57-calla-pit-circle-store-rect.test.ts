/**
 * Wave 57 leftover after #262 — Calla pit circle + store rect chrome.
 * Distinct from wave56 svg percent size. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 57 calla — pit circle store rect', () => {
  it('mounts pit-circle, store-rect, and board/store rx values', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(el.querySelector('.calla-pit-circle')).toBeTruthy();
    expect(el.querySelector('.calla-store-rect')).toBeTruthy();
    expect(el.querySelector('.calla-board-bg')?.getAttribute('rx')).toBe('20');
    expect(el.querySelector('.calla-store-rect')?.getAttribute('rx')).toBe('10');
  });
});
