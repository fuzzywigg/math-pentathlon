/**
 * Wave 44 overnight HEAVY — Fab AI easy teaching branch.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 fab AI — easy teaching', () => {
  it('returns concrete move on opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // skip suboptimal branch
    const move = getAIMove(createInitialState(), 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.bar1Id).not.toBe(move!.bar2Id);
  });

  it('can pick suboptimal when random < 0.4', () => {
    // First random in getTeachingMove: <0.4 → suboptimal; then floor pick
    const spy = vi.spyOn(Math, 'random');
    spy.mockReturnValueOnce(0.1).mockReturnValue(0);
    const move = getAIMove(createInitialState(), 'player1', 'easy');
    expect(move).not.toBeNull();
  });
});
