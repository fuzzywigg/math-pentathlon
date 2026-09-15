/**
 * Wave 65 leftover after tip/#315 — Kwatro chip value font-size 16.
 * Opening chip mount covered; deepen text font-size leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderBoard } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 65 kwatro — render chip text fontsize 16', () => {
  it('chip value text uses font-size 16 and bold white fill', () => {
    const el = renderBoard(createInitialState(), () => undefined, () => undefined);
    const text = el.querySelector('text');
    expect(text?.getAttribute('font-size')).toBe('16');
    expect(text?.getAttribute('font-weight')).toBe('bold');
    expect(text?.getAttribute('fill')).toBe('#fff');
    expect(text?.getAttribute('text-anchor')).toBe('middle');
  });
});
