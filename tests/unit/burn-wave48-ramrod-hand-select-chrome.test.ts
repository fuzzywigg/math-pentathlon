/**
 * Wave 48 — Ramrod hand selectable/selected chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectRod } from '../../src/games/ramrod/rules';
import { renderPlayerRods } from '../../src/games/ramrod/board-ui';

describe('Wave 48 ramrod — hand select chrome', () => {
  it('current seat selectingRod rods are selectable', () => {
    const s = createInitialState();
    const el = renderPlayerRods(s, 'player1', () => undefined);
    expect(el.querySelectorAll('.ramrod-rod-wrapper.selectable').length).toBe(s.playerRods.player1.length);
    const p2 = renderPlayerRods(s, 'player2', () => undefined);
    expect(p2.querySelectorAll('.selectable')).toHaveLength(0);
  });

  it('selectedRod wrapper gets selected class only for that rod', () => {
    const s = createInitialState();
    const rodId = s.playerRods.player1[0];
    const selected = selectRod(s, rodId);
    const el = renderPlayerRods(selected, 'player1', () => undefined);
    expect(el.querySelectorAll('.selected')).toHaveLength(1);
  });
});
