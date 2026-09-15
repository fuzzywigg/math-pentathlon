/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro chip text chrome.
 * Wave51 locks value textContent; deepen font-size/weight/fill/anchor. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 66 kwatro — render chip text chrome', () => {
  it('chip value text is 16 bold white middle-anchored', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const text = el.querySelector('[data-node-id="n0-0"] text');
    expect(text?.getAttribute('font-size')).toBe('16');
    expect(text?.getAttribute('font-weight')).toBe('bold');
    expect(text?.getAttribute('fill')).toBe('#fff');
    expect(text?.getAttribute('text-anchor')).toBe('middle');
  });
});
