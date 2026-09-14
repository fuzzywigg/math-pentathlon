/**
 * Wave 56 leftover after #256 — Ramrod opening Sum label catalog.
 * Distinct from wave48 first-label smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { CONFIG } from '../../src/games/ramrod/types';
import { renderBoard } from '../../src/games/ramrod/board-ui';

describe('Wave 56 ramrod — opening sum label catalog', () => {
  it('every opening box shows Sum: target matching box map', () => {
    const s = createInitialState();
    const el = renderBoard(s, () => undefined);
    const labels = [...el.querySelectorAll('.ramrod-box-label')].map(
      (n) => n.textContent ?? ''
    );
    expect(labels.length).toBe(CONFIG.BOARD_ROWS * CONFIG.BOARD_COLS);
    expect(labels.length).toBe(s.boxes.size);
    for (const box of s.boxes.values()) {
      expect(labels).toContain(`Sum: ${box.targetSum}`);
    }
  });
});
