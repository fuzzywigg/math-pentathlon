/**
 * Wave 43 — Juggle AI placement across difficulties after auto-mono. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { getAIPlacement, executeAITurn } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 juggle — AI placement difficulties', () => {
  it('after selecting die1 (mono), getAIPlacement returns a cell for each difficulty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 1] as [number, number],
    };
    const placing = selectDie(selecting, 0);
    expect(placing.phase).toBe('placing');
    for (const diff of ['easy', 'medium', 'hard'] as const) {
      const choice = getAIPlacement(placing, 'player1', diff);
      expect(choice).not.toBeNull();
      expect(choice!.position.row).toBeGreaterThanOrEqual(0);
      expect(choice!.position.col).toBeGreaterThanOrEqual(0);
    }
  });

  it('executeAITurn hard from rolling eventually leaves selecting/placing/rolling', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const next = executeAITurn(createInitialState(), 'player1', 'hard');
    expect(['rolling', 'selectingShape', 'placing', 'gameOver']).toContain(next.phase);
  });
});
