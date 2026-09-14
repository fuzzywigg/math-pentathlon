/**
 * Overnight HEAVY leftover after #256 — #tutorial-btn inside .game-header prefers
 * tutorial chrome. Distinct from wave55 new-game-in-header. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core owl — inspect tutorial in header', () => {
  it('tutorial control nested in game-header resolves tutorial', () => {
    const header = document.createElement('header');
    header.className = 'game-header';
    const btn = document.createElement('button');
    btn.id = 'tutorial-btn';
    btn.textContent = 'Tutorial';
    header.appendChild(btn);
    document.body.appendChild(header);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'chrome',
      chrome: 'tutorial',
    });
    expect(inspectDropSpeech(btn)).toMatch(/Tutorial starts a guided/i);
  });
});
