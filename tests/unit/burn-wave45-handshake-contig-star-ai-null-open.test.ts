/**
 * Wave 45 — Handshake Contig+Star AI null on opening rolling/draw
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { createInitialState as createStar } from '../../src/games/star-track/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';
import { getAIChainChoice } from '../../src/games/star-track/ai';

describe('Wave 45 handshake — Contig/Star AI null openings', () => {
  it('both AIs refuse opening phases that are not their decision phase', () => {
    expect(getAIPlacement(createContig(), 'player1', 'hard')).toBeNull();
    expect(getAIChainChoice(createStar(), 'player1', 'hard')).toBeNull();
  });
});
