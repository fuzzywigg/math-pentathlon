/**
 * Overnight HEAVY leftover after #250 — #new-game-btn inside .game-header
 * prefers new-game chrome over header. Distinct from wave40 help-in-row. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 core owl — inspect new-game in header', () => {
  it('new-game control nested in game-header resolves new-game', () => {
    const header = document.createElement('header');
    header.className = 'game-header';
    const btn = document.createElement('button');
    btn.id = 'new-game-btn';
    btn.textContent = 'New Game';
    header.appendChild(btn);
    document.body.appendChild(header);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'chrome',
      chrome: 'new-game',
    });
    expect(inspectDropSpeech(btn)).toMatch(/New Game resets/i);
  });
});
