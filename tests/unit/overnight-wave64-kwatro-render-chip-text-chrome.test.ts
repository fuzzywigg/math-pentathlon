/**
 * Wave 64 leftover after tip/#306 — Kwatro chip text font chrome.
 * Wave51 locked textContent value; deepen font-size/anchor/fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 64 kwatro — render chip text chrome', () => {
  it('chip text is 16 bold middle fill #fff', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const text = el.querySelector('[data-node-id="n0-0"] text');
    expect(text?.getAttribute('font-size')).toBe('16');
    expect(text?.getAttribute('text-anchor')).toBe('middle');
    expect(text?.getAttribute('font-weight')).toBe('bold');
    expect(text?.getAttribute('fill')).toBe('#fff');
  });
});
