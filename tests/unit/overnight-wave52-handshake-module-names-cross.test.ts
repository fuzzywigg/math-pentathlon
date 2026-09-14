/**
 * Overnight HEAVY leftover after #234 — Cross-module name sanity (not hex board-ui).
 * Distinct from wave51 leftover board-ui name handshakes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { DEFAULT_GRAPH_CONFIG } from '../../src/core/graph';
import { TETROMINOES, createRotationControls } from '../../src/core/polyomino';
import { DIRECTIONS } from '../../src/core/alignment';
import { OWL_FRICTION, OWL_REST_SPEED } from '../../src/core/owl';

describe('Wave 52 handshake — module names cross', () => {
  it('shared defaults stay stable across four cores', () => {
    expect(DEFAULT_GRAPH_CONFIG.nodeColors.player1).toBeTruthy();
    expect(TETROMINOES.some((s) => s.id === 'L' && s.canFlip === false)).toBe(true);
    expect(typeof createRotationControls).toBe('function');
    expect(DIRECTIONS.HORIZONTAL).toMatchObject({ name: 'horizontal', dRow: 0, dCol: 1 });
    expect(OWL_FRICTION).toBeGreaterThan(0);
    expect(OWL_FRICTION).toBeLessThan(1);
    expect(OWL_REST_SPEED).toBeGreaterThan(0);
  });
});
