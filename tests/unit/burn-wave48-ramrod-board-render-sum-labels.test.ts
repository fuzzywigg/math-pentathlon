/**
 * Wave 48 — Ramrod renderBoard sum labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';

describe('Wave 48 ramrod — board sums', () => {
  it('renders box labels for each sum box', () => {
    const s = createInitialState();
    const el = renderBoard(s, () => undefined);
    expect(el.querySelectorAll('.ramrod-box').length).toBe(s.boxes.size);
    expect(el.querySelector('.ramrod-box-label')?.textContent).toMatch(/Sum:/);
  });
});
