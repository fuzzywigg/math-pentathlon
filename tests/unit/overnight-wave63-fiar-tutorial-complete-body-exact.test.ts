/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — FIAR complete body exact.
 * Wave54 soft Finish/four; deepen Now you know FIAR leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 63 fiar — tutorial complete body exact', () => {
  it('complete says Now you know how to play FIAR', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Now you know how to play FIAR!');
    expect(step?.message).toContain('get four in a row!');
  });
});
