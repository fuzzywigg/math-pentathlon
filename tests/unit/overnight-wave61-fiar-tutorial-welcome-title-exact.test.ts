/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — FIAR welcome title exact.
 * Wave55 matches message; deepen welcome title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 61 fiar — tutorial welcome title exact', () => {
  it('welcome title is exact Welcome to FIAR!', () => {
    const welcome = fiarTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.title).toBe('Welcome to FIAR!');
    expect(welcome?.message).toContain('FIAR (Four In A Row)');
  });
});
