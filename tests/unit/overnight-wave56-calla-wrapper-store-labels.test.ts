/**
 * Wave 56 leftover after #256 — Calla wrapper + store label chrome.
 * Distinct from wave52 store counts/active. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — wrapper store labels', () => {
  it('mounts calla-wrapper and nonempty store labels on both seats', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(el.querySelector('.calla-wrapper')).toBeTruthy();
    const labels = [...el.querySelectorAll('.calla-store-label')];
    expect(labels.length).toBe(2);
    expect(labels.every((n) => (n.textContent ?? '').length > 0)).toBe(true);
  });
});
