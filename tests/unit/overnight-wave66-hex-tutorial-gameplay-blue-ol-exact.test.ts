/**
 * Wave 66 leftover after tip/#316 — Hex gameplay Blue-first ol exact.
 * Soft Blue goes first; lock full ol li leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 66 hex — tutorial gameplay blue ol exact', () => {
  it('gameplay ol Blue first + empty hex + immovable exact', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.message).toContain('<li>Blue goes first</li>');
    expect(step?.message).toContain(
      '<li>On your turn, click any empty hex to place your piece</li>'
    );
    expect(step?.message).toContain('<li>Pieces cannot be moved once placed</li>');
  });
});
