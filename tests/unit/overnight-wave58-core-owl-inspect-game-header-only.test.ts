/**
 * Overnight HEAVY leftover after #274 — bare .game-header chrome speech.
 * Distinct from wave55 nested #new-game-btn preference. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 core owl — inspect bare game-header', () => {
  it('header without known control ids resolves game-header chrome', () => {
    const header = document.createElement('header');
    header.className = 'game-header';
    header.textContent = 'Kings & Quadraphages';
    document.body.appendChild(header);
    expect(resolveInspectTarget(header)).toEqual({
      kind: 'chrome',
      chrome: 'game-header',
    });
    expect(inspectDropSpeech(header)).toMatch(/game title area/i);
  });
});
