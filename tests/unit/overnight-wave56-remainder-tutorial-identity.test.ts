/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder tutorial identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { remainderIslandsTutorial } from '../../src/games/remainder-islands/tutorial';

describe('Wave 56 remainder — tutorial identity', () => {
  it('catalog id/name leftover', () => {
    expect(remainderIslandsTutorial.id).toBe('remainder-islands-basics');
    expect(remainderIslandsTutorial.name).toBe('Learn Remainder Islands');
  });
});
