/**
 * Wave 64 leftover after tip/#303 — Juggle placement-rules fit entirely.
 * Soft rotated/flipped + cannot overlap; deepen fit-entirely leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 64 juggle — tutorial placement fit', () => {
  it('locks fit entirely within 9x9 + boards highlight', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'placement-rules');
    expect(step?.title).toBe('Placement Rules');
    expect(step?.message).toContain(
      'Shapes must fit entirely within your 9x9 grid'
    );
    expect(step?.highlightSelector).toBe('.juggle-boards');
    expect(step?.position).toBe('top');
  });
});
