/**
 * Overnight HEAVY leftover after #274 — star-piece empty data-player → unknown.
 * Distinct from wave56 Blue piece / wave57 star-space default. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 core owl — inspect star-piece empty player', () => {
  it('empty data-player attribute falls back to unknown', () => {
    const piece = document.createElement('div');
    piece.className = 'star-track-piece';
    piece.setAttribute('data-player', '');
    document.body.appendChild(piece);
    expect(resolveInspectTarget(piece)).toEqual({
      kind: 'star-piece',
      player: 'unknown',
    });
    expect(inspectDropSpeech(piece)).toMatch(/Star Track piece for unknown/i);
  });
});
