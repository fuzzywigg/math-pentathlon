/**
 * Wave 67 leftover after tip/#316 — FIAR complete Finish strong exact.
 * Wave63 Now-you-know + four; lock Click <strong>Finish</strong> leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial complete finish strong', () => {
  it('complete uses exact Finish strong four-in-a-row CTA', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and get four in a row!'
    );
  });
});
