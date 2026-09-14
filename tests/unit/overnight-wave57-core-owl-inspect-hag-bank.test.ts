/**
 * Overnight HEAVY leftover after #264 — Hex-a-Gone bank shape speech.
 * Distinct from wave52 empty data-shape; wave40 priority without speech. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 core owl — inspect hex-a-gone-bank', () => {
  it('data-shape resolves bank speech', () => {
    const btn = document.createElement('button');
    btn.setAttribute('data-shape', 'V');
    document.body.appendChild(btn);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'hex-a-gone-bank',
      shape: 'V',
    });
    expect(inspectDropSpeech(btn)).toMatch(/Pattern-block bank: V/i);
  });
});
