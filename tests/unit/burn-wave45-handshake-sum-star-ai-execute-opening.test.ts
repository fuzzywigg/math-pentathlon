/**
 * Wave 45 — Handshake Sum+Star executeAITurn from openings
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import { createInitialState as createStar } from '../../src/games/star-track/types';
import { executeAITurn as execSum } from '../../src/games/sum-dominoes/ai';
import { executeAITurn as execStar } from '../../src/games/star-track/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 45 handshake — Sum/Star execute openings', () => {
  it('each engine advances off its opening phase', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const sum = execSum(createSum(), 'player1', 'hard');
    expect(['rolling', 'placing', 'passing', 'gameOver']).toContain(sum.phase);
    const star = execStar(createStar(), 'player1', 'hard');
    expect(star.moveHistory.length + (star.phase === 'gameOver' ? 1 : 0)).toBeGreaterThan(0);
    expect(['drawChains', 'selectChain', 'gameOver']).toContain(star.phase);
  });
});
