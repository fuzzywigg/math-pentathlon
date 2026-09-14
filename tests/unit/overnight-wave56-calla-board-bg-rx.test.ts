/**
 * Wave 56 leftover after #256 — Calla board background rx + dimensions.
 * Complements wave52 viewBox; exact rounded rect attrs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — board bg rx', () => {
  it('uses rx=20 on 500×200 board background rect', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const bg = el.querySelector('.calla-board-bg');
    expect(bg?.getAttribute('rx')).toBe('20');
    expect(bg?.getAttribute('width')).toBe('500');
    expect(bg?.getAttribute('height')).toBe('200');
    expect(bg?.getAttribute('x')).toBe('0');
    expect(bg?.getAttribute('y')).toBe('0');
  });
});
