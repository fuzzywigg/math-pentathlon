/**
 * Wave 69 leftover after tip/#350 — Star Track draw-button strong label.
 * Soft "Draw Chains" string existed; lock <strong>"Draw Chains"</strong>. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { starTrackTutorial } from '../../src/games/star-track/tutorial';

describe('Wave 69 star-track — tutorial draw-button strong', () => {
  it('draw-button pins exact strong Draw Chains markup', () => {
    const step = starTrackTutorial.steps.find((s) => s.id === 'draw-button');
    expect(step?.title).toBe('Drawing Chains');
    expect(step?.message).toContain('<strong>"Draw Chains"</strong>');
    expect(step?.highlightSelector).toBe('.star-track-draw-btn');
    expect(step?.position).toBe('bottom');
  });
});
