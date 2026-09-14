/**
 * Wave 49 leftover after #221/#226/#227 — Kwatro renderChipInfo parity labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderChipInfo } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — chip info', () => {
  it('lists even/odd chip sets for Blue and Red', () => {
    const el = renderChipInfo(createInitialState());
    expect(el.classList.contains('kwa-chip-info')).toBe(true);
    expect(el.textContent).toMatch(/Even/);
    expect(el.textContent).toMatch(/Odd/);
    expect(el.textContent).toMatch(/0, 2, 4/);
    expect(el.textContent).toMatch(/1, 3, 5/);
  });
});
