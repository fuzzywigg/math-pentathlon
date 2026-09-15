/**
 * Wave 66 leftover after tip/#316 — Kwatro chip text font-size 16 / bold / white.
 * Wave51 soft value presence; deepen typography leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 66 kwatro — render chip text fontsize 16', () => {
  it('chip value text is 16 bold white middle', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const text = el.querySelector('text');
    expect(text?.getAttribute('font-size')).toBe('16');
    expect(text?.getAttribute('font-weight')).toBe('bold');
    expect(text?.getAttribute('fill')).toBe('#fff');
    expect(text?.getAttribute('text-anchor')).toBe('middle');
  });
});
