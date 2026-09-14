/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum tutorial welcome/setup. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 56 sum — tutorial welcome setup', () => {
  it('welcome rid-of-dominoes + setup 7/center leftover', () => {
    const welcome = sumDominoesTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.message).toMatch(/get rid of all your dominoes/);
    const setup = sumDominoesTutorial.steps.find((s) => s.id === 'setup');
    expect(setup?.message).toMatch(/Each player receives 7/);
    expect(setup?.message).toMatch(/center of the board/);
  });
});
