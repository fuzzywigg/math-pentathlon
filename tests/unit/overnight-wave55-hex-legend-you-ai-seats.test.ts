/**
 * Wave 55 leftover after #250 — Hex HvA legend You/AI seats. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hex — HvA legend', () => {
  it('You Top↔Bottom and AI Left↔Right', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(5), el, 'human-vs-ai');
    expect(el.querySelector('.hex-legend-p1')?.textContent).toMatch(/You: Top ↔ Bottom/);
    expect(el.querySelector('.hex-legend-p2')?.textContent).toMatch(/AI: Left ↔ Right/);
  });
});
