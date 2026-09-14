/**
 * Wave 59 leftover after #276 — Hex gameplay immovable pieces + selector. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 59 hex — tutorial gameplay immovable', () => {
  it('gameplay full immovable sentence; .hex-board; bottom', () => {
    const gameplay = hexTutorial.steps.find((s) => s.id === 'gameplay');
    expect(gameplay?.message).toMatch(/Pieces cannot be moved once placed/);
    expect(gameplay?.highlightSelector).toBe('.hex-board');
    expect(gameplay?.position).toBe('bottom');
  });
});
