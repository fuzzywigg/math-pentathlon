/**
 * Overnight HEAVY leftover after #256 — #tutorial-btn resolves tutorial chrome.
 * Distinct from wave52 unknown tutorial gameId. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core owl — inspect tutorial', () => {
  it('tutorial control resolves tutorial chrome speech', () => {
    const btn = document.createElement('button');
    btn.id = 'tutorial-btn';
    document.body.appendChild(btn);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'chrome',
      chrome: 'tutorial',
    });
    expect(inspectDropSpeech(btn)).toMatch(/guided walk-through/i);
  });
});
