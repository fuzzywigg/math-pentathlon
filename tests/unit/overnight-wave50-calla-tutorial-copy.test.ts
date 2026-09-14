/**
 * Overnight HEAVY leftover — Calla tutorial titles and live copy fragments.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Overnight wave50 calla — tutorial copy', () => {
  it('keeps titles and capture/free-turn teaching copy', () => {
    const byId = Object.fromEntries(
      callaTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['welcome']?.title).toBe('Welcome to Calla!');
    expect(byId['goal']?.title).toBe('How to Win');
    expect(byId['free-turn']?.title).toBe('Free Turn!');
    expect(byId['capture']?.title).toBe('Capturing');
    expect(byId['complete']?.title).toBe('Ready to Play!');
    expect(byId['goal']?.message).toMatch(/most cubes in your Calla/i);
    expect(byId['pits-explained']?.message).toMatch(/3 cubes/);
    expect(byId['free-turn']?.message).toMatch(/last cube lands in your Calla/i);
    expect(byId['capture']?.message).toMatch(/empty pit on YOUR side/i);
    expect(byId['how-to-move']?.message).toMatch(/counter-clockwise/i);
  });
});
