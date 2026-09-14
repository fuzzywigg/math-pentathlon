/**
 * Wave 56 leftover after #256 — Juggle tutorial id catalog.
 * Distinct from burn highlight spot-checks. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 56 juggle — tutorial ids', () => {
  it('keeps learn-juggle identity and ordered step ids', () => {
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
  });
});
