/**
 * Overnight HEAVY leftover after #226/#227/#233 — Calla tutorial step ids. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Overnight wave50 calla — tutorial step ids', () => {
  it('keeps the live 10-step sequence and unique ids', () => {
    const ids = callaTutorial.steps.map((s) => s.id);
    expect(ids).toEqual([
      'welcome',
      'goal',
      'board-intro',
      'pits-explained',
      'how-to-move',
      'your-calla',
      'free-turn',
      'capture',
      'strategy-tip',
      'complete',
    ]);
    expect(new Set(ids).size).toBe(ids.length);
    expect(callaTutorial.id).toBe('calla-basics');
    expect(callaTutorial.name).toBe('Learn Calla');
  });
});
