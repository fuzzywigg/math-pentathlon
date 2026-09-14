/**
 * Overnight HEAVY leftover after #264 — star-space missing data-player → unknown.
 * Distinct from wave56 Red/Blue happy path. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 core owl — star-space default player', () => {
  it('omitted data-player falls back to unknown', () => {
    const space = document.createElement('div');
    space.className = 'star-track-space';
    space.setAttribute('data-space', '7');
    document.body.appendChild(space);
    expect(resolveInspectTarget(space)).toEqual({
      kind: 'star-space',
      space: 7,
      player: 'unknown',
    });
    expect(inspectDropSpeech(space)).toMatch(/space 7 \(unknown\)/i);
  });
});
