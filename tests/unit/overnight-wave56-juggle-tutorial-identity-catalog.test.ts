/**
 * Wave 56 leftover after #256 — Juggle tutorial identity + step catalog.
 * Mirrors calla wave50 tutorial leftovers; juggle-only after #256. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 56 juggle — tutorial identity catalog', () => {
  it('keeps id/name and ordered step ids', () => {
    expect(juggleTutorial.id).toBe('juggle-basics');
    expect(juggleTutorial.name).toBe('Learn Juggle');
    expect(juggleTutorial.steps.map((s) => s.id)).toEqual([
      'welcome',
      'objective',
      'turn-sequence',
      'dice-values',
      'placement-rules',
      'strategy-tips',
      'complete',
    ]);
    expect(juggleTutorial.steps[0]?.title).toBe('Welcome to Juggle!');
    expect(juggleTutorial.steps.at(-1)?.title).toBe('Ready to Play!');
  });
});
