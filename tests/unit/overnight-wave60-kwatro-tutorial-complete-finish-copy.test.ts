/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro complete Finish CTA exact.
 * Wave55/57 match make 4 or 5; deepen Finish strong + Know how copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 60 kwatro — tutorial complete finish copy', () => {
  it('complete message includes Finish CTA and know-how line', () => {
    const done = kwatroSinkoTutorial.steps.find((s) => s.id === 'complete');
    expect(done?.message).toContain(
      'Now you know how to play Kwatro-Sinko!'
    );
    expect(done?.message).toContain('<strong>Finish</strong>');
    expect(done?.message).toContain('and make 4 or 5!');
  });
});
