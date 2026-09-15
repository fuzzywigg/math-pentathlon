/**
 * Wave 66 leftover after tip/#316 — FIAR complete Finish get-four exact.
 * Wave63 soft get four in a row; deepen Finish strong paragraph leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 66 fiar — tutorial complete finish exact', () => {
  it('complete urges Finish and get four in a row', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      '<p>Click <strong>Finish</strong> and get four in a row!</p>'
    );
    expect(step?.position).toBe('center');
  });
});
