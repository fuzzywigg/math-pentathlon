/**
 * Wave 67 leftover after tip/#336 — FIAR complete Ready title exact.
 * Wave63 title Ready; dedicated leftover after #316. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial complete title ready', () => {
  it('complete title is Ready to Play!', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
  });
});
