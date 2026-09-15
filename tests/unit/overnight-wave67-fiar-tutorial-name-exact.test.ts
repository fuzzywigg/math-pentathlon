/**
 * Wave 67 leftover after tip/#316 — FIAR tutorial config name exact.
 * Soft Learn FIAR match; lock name + id leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial name exact', () => {
  it('tutorial name is Learn FIAR', () => {
    expect(fiarTutorial.name).toBe('Learn FIAR');
    expect(fiarTutorial.id).toBe('fiar-basics');
  });
});
