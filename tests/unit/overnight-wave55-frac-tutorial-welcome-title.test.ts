/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact welcome title/copy.
 * Wave54 catalog skipped welcome title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 55 frac tutorial — welcome', () => {
  it('welcome title and scoring-vs-opponent copy', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.title).toBe('Welcome to Frac Fact!');
    expect(step?.message).toMatch(/Score more points than your opponent/);
    expect(step?.position).toBe('center');
  });
});
