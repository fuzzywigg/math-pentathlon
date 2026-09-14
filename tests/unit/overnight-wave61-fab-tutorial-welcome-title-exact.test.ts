/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab welcome title exact.
 * Wave55 matches message; deepen welcome title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 61 fab — tutorial welcome title exact', () => {
  it('welcome title is exact Welcome to Fab-a-Diffy!', () => {
    const welcome = fabADiffyTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.title).toBe('Welcome to Fab-a-Diffy!');
    expect(welcome?.message).toContain("Let's learn how to play");
  });
});
