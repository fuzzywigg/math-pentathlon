/**
 * Wave 49 — Kwatro renderChipInfo even/odd catalog leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderChipInfo } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 49 kwatro — chip info', () => {
  it('lists Blue even and Red odd values', () => {
    const el = renderChipInfo(createInitialState());
    expect(el.className).toBe('kwa-chip-info');
    expect(el.querySelector('.player1')?.textContent).toMatch(/Blue \(Even\):/);
    expect(el.querySelector('.player1')?.textContent).toMatch(/0, 2, 4, 6, 8/);
    expect(el.querySelector('.player2')?.textContent).toMatch(/Red \(Odd\):/);
    expect(el.querySelector('.player2')?.textContent).toMatch(/1, 3, 5, 7, 9/);
  });
});
