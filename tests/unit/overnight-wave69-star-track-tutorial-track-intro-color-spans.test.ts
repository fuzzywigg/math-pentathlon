/**
 * Wave 69 leftover after tip/#350 — Star Track track-intro Blue/Red spans.
 * Soft board highlightSelector existed; lock color spans. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { starTrackTutorial } from '../../src/games/star-track/tutorial';

describe('Wave 69 star-track — tutorial track-intro color spans', () => {
  it('track-intro pins Blue/Red color spans and board highlight', () => {
    const step = starTrackTutorial.steps.find((s) => s.id === 'track-intro');
    expect(step?.title).toBe('The Star Track');
    expect(step?.message).toContain(
      '<span style="color: #2196F3">Blue</span>'
    );
    expect(step?.message).toContain(
      '<span style="color: #e53935">Red</span>'
    );
    expect(step?.message).toContain('<strong>star</strong>');
    expect(step?.highlightSelector).toBe('.star-track-board');
    expect(step?.position).toBe('bottom');
  });
});
