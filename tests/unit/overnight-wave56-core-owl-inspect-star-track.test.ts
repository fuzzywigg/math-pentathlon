/**
 * Overnight HEAVY leftover after #256 — star-space / star-piece inspect stubs.
 * Distinct from wave55 new-game chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core owl — inspect star track', () => {
  it('star-track-space resolves space + player speech', () => {
    const space = document.createElement('div');
    space.className = 'star-track-space';
    space.setAttribute('data-space', '4');
    space.setAttribute('data-player', 'Red');
    document.body.appendChild(space);
    expect(resolveInspectTarget(space)).toEqual({
      kind: 'star-space',
      space: 4,
      player: 'Red',
    });
    expect(inspectDropSpeech(space)).toMatch(/Star Track space 4 \(Red\)/i);
  });

  it('star-track-piece resolves player speech', () => {
    const piece = document.createElement('div');
    piece.className = 'star-track-piece';
    piece.setAttribute('data-player', 'Blue');
    document.body.appendChild(piece);
    expect(resolveInspectTarget(piece)).toEqual({
      kind: 'star-piece',
      player: 'Blue',
    });
    expect(inspectDropSpeech(piece)).toMatch(/Star Track piece for Blue/i);
  });
});
