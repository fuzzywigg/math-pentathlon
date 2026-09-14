/**
 * Overnight HEAVY leftover after #256 — #help-btn resolves howto chrome.
 * Distinct from wave55 new-game-in-header. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core owl — inspect howto', () => {
  it('help control resolves howto chrome speech', () => {
    const btn = document.createElement('button');
    btn.id = 'help-btn';
    document.body.appendChild(btn);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'chrome',
      chrome: 'howto',
    });
    expect(inspectDropSpeech(btn)).toMatch(/How to Play/i);
  });
});
