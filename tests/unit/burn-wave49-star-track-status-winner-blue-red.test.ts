/**
 * Wave 49 — Star-track hvh winner Blue/Red. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderStatus } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — hvh winners', () => {
  it('labels Blue/Red', () => {
    const box = document.createElement('div');
    const base = { ...createInitialState(), phase: 'gameOver' as const, winner: 'player2' as const };
    renderStatus(base, box, 'human-vs-human');
    expect(box.querySelector('.status-winner')?.textContent).toMatch(/Red Wins/);
  });
});
