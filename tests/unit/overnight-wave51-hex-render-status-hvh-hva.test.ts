/**
 * Wave 51 leftover after #233 — classic Hex status HvH vs HvA. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

describe('Wave 51 hex — status seats', () => {
  it('shows Blue/Red HvH and You/AI HvA chrome', () => {
    const state = createInitialState(5);
    const hvh = document.createElement('div');
    renderStatus(state, hvh, 'human-vs-human');
    expect(hvh.textContent).toMatch(/Blue/);
    expect(hvh.textContent).toMatch(/Red/);
    expect(hvh.querySelector('.status-mode')).toBeNull();

    const hva = document.createElement('div');
    renderStatus(state, hva, 'human-vs-ai');
    expect(hva.querySelector('.status-mode')?.textContent).toBe('vs AI');
    expect(hva.textContent).toMatch(/You/);
    expect(hva.textContent).toMatch(/AI/);
  });
});
