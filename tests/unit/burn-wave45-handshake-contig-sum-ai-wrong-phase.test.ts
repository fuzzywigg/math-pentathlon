/**
 * Wave 45 — Handshake Contig+Sum AI wrong-phase matrix
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import { getAIPlacement } from '../../src/games/contig-60/ai';
import { getAIMove } from '../../src/games/sum-dominoes/ai';

describe('Wave 45 handshake — Contig/Sum AI wrong phase', () => {
  it('opening rolling yields null for both placement AIs', () => {
    expect(getAIPlacement(createContig(), 'player1')).toBeNull();
    expect(getAIMove(createSum(), 'player1')).toBeNull();
  });
});
