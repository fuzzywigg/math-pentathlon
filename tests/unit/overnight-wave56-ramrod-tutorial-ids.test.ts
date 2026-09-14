/**
 * Wave 56 leftover after #256 — Ramrod tutorial id catalog.
 * Distinct from burn highlight-only checks. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';

describe('Wave 56 ramrod — tutorial ids', () => {
  it('keeps learn-ramrod identity and ordered step ids', () => {
    expect(ramrodTutorial.id).toBe('ramrod-basics');
    expect(ramrodTutorial.name).toBe('Learn Ramrod');
    expect(ramrodTutorial.steps.map((s) => s.id)).toEqual([
      'welcome',
      'objective',
      'cuisenaire-rods',
      'turn-sequence',
      'capturing-rules',
      'winning',
      'strategy-tips',
      'complete',
    ]);
  });
});
