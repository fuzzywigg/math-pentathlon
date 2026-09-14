/**
 * Wave 45 — Contig getOpponent player2→player1
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { getOpponent } from '../../src/games/contig-60/types';

describe('Wave 45 Contig — getOpponent reverse', () => {
  it('maps player2 to player1', () => {
    expect(getOpponent('player2')).toBe('player1');
    expect(getOpponent('player1')).toBe('player2');
  });
});
