/**
 * Overnight HEAVY leftover after #256 — star-space missing data-player → unknown.
 * Distinct from wave40 empty player on piece / non-finite space. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core owl — star-space unknown player', () => {
  it('finite data-space without data-player yields player unknown', () => {
    const space = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    space.setAttribute('class', 'star-track-space');
    space.setAttribute('data-space', '5');
    document.body.appendChild(space);
    expect(resolveInspectTarget(space)).toEqual({
      kind: 'star-space',
      space: 5,
      player: 'unknown',
    });
    expect(inspectDropSpeech(space)).toMatch(/space 5 \(unknown\)/i);
  });
});
