/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig tutorial welcome/objective. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('Wave 56 contig — tutorial welcome objective', () => {
  it('welcome title and adjacent-chips objective leftover', () => {
    const welcome = contig60Tutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.title).toBe('Welcome to Contig 60!');
    const objective = contig60Tutorial.steps.find((s) => s.id === 'objective');
    expect(objective?.message).toMatch(/adjacent to other chips/);
  });
});
