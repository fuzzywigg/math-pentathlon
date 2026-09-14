/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — FIAR winning title + Form 4.
 * Soft axes/blocking coverage exists; deepen title + Form 4 chips leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 63 fiar — tutorial winning title form4', () => {
  it('winning title is Winning and Form 4 chips copy exact', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.title).toBe('Winning');
    expect(step?.message).toContain(
      'Form 4 chips in a row along connected pathways'
    );
    expect(step?.message).toContain('<strong>Blocking:</strong>');
  });
});
