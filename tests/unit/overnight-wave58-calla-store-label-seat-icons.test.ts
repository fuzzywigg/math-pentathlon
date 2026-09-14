/**
 * Wave 58 leftover after #262 (retry #273 RED) — Calla store label seat icons.
 * Distinct from wave56 nonempty labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 58 calla — store label seat icons', () => {
  it('renders Blue/Red seat icons on store labels', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const labels = [...el.querySelectorAll('.calla-store-label')].map(
      (n) => n.textContent
    );
    expect(labels).toContain('🔵');
    expect(labels).toContain('🔴');
  });
});
