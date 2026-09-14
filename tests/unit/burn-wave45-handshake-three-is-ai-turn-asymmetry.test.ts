/**
 * Wave 45 — Handshake Contig/Sum/Star isAITurn signature asymmetry
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import { createInitialState as createStar } from '../../src/games/star-track/types';
import { isAITurn as contigAI } from '../../src/games/contig-60/ai';
import { isAITurn as sumAI } from '../../src/games/sum-dominoes/ai';
import { isAITurn as starAI } from '../../src/games/star-track/ai';

describe('Wave 45 handshake — isAITurn asymmetry', () => {
  it('Sum ignores mode; Contig/Star require human-vs-ai', () => {
    expect(contigAI(createContig(), 'player1', 'human-vs-human')).toBe(false);
    expect(starAI(createStar(), 'player1', 'human-vs-human')).toBe(false);
    expect(sumAI(createSum(), 'player1')).toBe(true);
  });
});
