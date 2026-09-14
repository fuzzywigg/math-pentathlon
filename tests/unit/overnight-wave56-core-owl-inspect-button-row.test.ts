/**
 * Overnight HEAVY leftover after #256 — .button-row chrome without known ids.
 * Distinct from wave55 new-game / wave40 help-in-row. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core owl — inspect button-row', () => {
  it('bare button-row span resolves button-row chrome', () => {
    const row = document.createElement('div');
    row.className = 'button-row';
    const span = document.createElement('span');
    span.textContent = 'controls';
    row.appendChild(span);
    document.body.appendChild(row);
    expect(resolveInspectTarget(span)).toEqual({
      kind: 'chrome',
      chrome: 'button-row',
    });
    expect(inspectDropSpeech(span)).toMatch(/game controls/i);
  });
});
