/**
 * Wave 55 leftover after #250 — Ramrod dark 6/7cm rod labels use white text.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { createRod } from '../../src/games/ramrod/types';
import { renderPlayerRods } from '../../src/games/ramrod/board-ui';

describe('Wave 55 ramrod — dark rod white label', () => {
  it('paints 6cm and 7cm in-hand labels white', () => {
    const s = createInitialState();
    const dark6 = createRod('dark-6', 6);
    const dark7 = createRod('dark-7', 7);
    dark6.owner = 'player1';
    dark7.owner = 'player1';
    const rods = new Map(s.rods);
    rods.set(dark6.id, dark6);
    rods.set(dark7.id, dark7);

    const el = renderPlayerRods(
      {
        ...s,
        rods,
        playerRods: { ...s.playerRods, player1: [dark6.id, dark7.id] },
      },
      'player1',
      () => undefined
    );
    const labels = [...el.querySelectorAll('.ramrod-rod-label')] as HTMLElement[];
    expect(labels.map((l) => l.textContent)).toEqual(['6', '7']);
    expect(labels.every((l) => l.style.color === 'rgb(255, 255, 255)' || l.style.color === '#fff')).toBe(
      true
    );
  });
});
