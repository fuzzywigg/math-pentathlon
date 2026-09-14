/**
 * Wave 48 — Ramrod renderScores goal + seat labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { CONFIG } from '../../src/games/ramrod/types';
import { renderScores } from '../../src/games/ramrod/board-ui';

describe('Wave 48 ramrod — renderScores', () => {
  it('shows goal and both seat scores', () => {
    const s = { ...createInitialState(), scores: { player1: 7, player2: 3 } };
    const el = renderScores(s);
    expect(el.querySelector('.ramrod-target')?.textContent).toContain(String(CONFIG.TARGET_SCORE));
    expect(el.textContent).toMatch(/Blue/);
    expect(el.textContent).toMatch(/Red/);
    expect(el.textContent).toMatch(/7cm/);
    expect(el.textContent).toMatch(/3cm/);
  });
});
