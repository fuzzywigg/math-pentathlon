/**
 * Wave 65 leftover after tip/#313 — Kings complete Finish to start. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 65 kings — tutorial complete finish start', () => {
  it('Finish to start playing', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toMatch(/Finish<\/strong> to start playing/);
  });
});
