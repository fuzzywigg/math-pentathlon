/**
 * Overnight HEAVY leftover after #256 — #back-btn inside .button-row prefers back.
 * Distinct from wave40 help-in-row. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core owl — inspect back in button-row', () => {
  it('back control nested in button-row resolves back', () => {
    const row = document.createElement('div');
    row.className = 'button-row';
    const btn = document.createElement('button');
    btn.id = 'back-btn';
    btn.textContent = 'Back';
    row.appendChild(btn);
    document.body.appendChild(row);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'chrome',
      chrome: 'back',
    });
    expect(inspectDropSpeech(btn)).toMatch(/Back takes you to the game list/i);
  });
});
