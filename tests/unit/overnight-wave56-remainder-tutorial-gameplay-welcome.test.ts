/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder tutorial gameplay/welcome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { remainderIslandsTutorial } from '../../src/games/remainder-islands/tutorial';

describe('Wave 56 remainder — tutorial gameplay welcome', () => {
  it('welcome title + gameplay dice highlight leftover', () => {
    const welcome = remainderIslandsTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.title).toBe('Welcome to Remainder Islands!');
    const gameplay = remainderIslandsTutorial.steps.find((s) => s.id === 'gameplay');
    expect(gameplay?.highlightSelector).toBe('.remainder-dice');
    expect(gameplay?.message).toMatch(/Roll two dice/);
  });
});
