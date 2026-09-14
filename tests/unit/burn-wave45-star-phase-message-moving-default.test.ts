/**
 * Wave 45 — Star Track getPhaseMessage empty default for moving phase
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { getPhaseMessage } from '../../src/games/star-track/rules';

describe('Wave 45 Star — moving phase default empty', () => {
  it('returns empty string for unused moving phase', () => {
    const state = { ...createInitialState(), phase: 'moving' as const };
    expect(getPhaseMessage(state)).toBe('');
  });
});
