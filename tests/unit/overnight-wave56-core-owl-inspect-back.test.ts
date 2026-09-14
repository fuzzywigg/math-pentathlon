/**
 * Overnight HEAVY leftover after #256 — #back-btn resolves back chrome.
 * Distinct from wave55 new-game-in-header. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core owl — inspect back', () => {
  it('back control resolves back chrome speech', () => {
    const btn = document.createElement('button');
    btn.id = 'back-btn';
    document.body.appendChild(btn);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'chrome',
      chrome: 'back',
    });
    expect(inspectDropSpeech(btn)).toMatch(/game list/i);
  });
});
