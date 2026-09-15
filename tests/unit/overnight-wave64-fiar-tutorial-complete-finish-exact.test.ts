/**
 * Wave 64 leftover after #305 — FIAR complete Finish four-in-a-row exact.
 * Wave63 locks Now you know + get four; deepen Finish strong leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 64 fiar — tutorial complete finish exact', () => {
  it('complete locks Finish strong and get four in a row', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and get four in a row!'
    );
  });
});
