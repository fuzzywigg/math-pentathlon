/**
 * Overnight HEAVY leftover after #264 — Hex-a-Gone axial cell speech.
 * Distinct from wave56 star/FIAR; wave40 NaN fallthrough only. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 core owl — inspect hex-a-gone-cell', () => {
  it('data-q/data-r resolves axial cell speech', () => {
    const cell = document.createElement('div');
    cell.setAttribute('data-q', '-1');
    cell.setAttribute('data-r', '2');
    document.body.appendChild(cell);
    expect(resolveInspectTarget(cell)).toEqual({
      kind: 'hex-a-gone-cell',
      q: -1,
      r: 2,
    });
    expect(inspectDropSpeech(cell)).toMatch(/q=-1, r=2/);
  });
});
