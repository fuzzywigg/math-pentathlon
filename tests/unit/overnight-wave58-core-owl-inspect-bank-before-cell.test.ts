/**
 * Overnight HEAVY leftover after #274 — data-shape bank wins over data-q/r cell.
 * Distinct from wave57 hag-bank / hag-cell separate hits. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 58 core owl — inspect bank before cell', () => {
  it('nested shape button under axial cell still resolves bank', () => {
    const cell = document.createElement('div');
    cell.setAttribute('data-q', '1');
    cell.setAttribute('data-r', '2');
    const btn = document.createElement('button');
    btn.setAttribute('data-shape', 'triangle');
    cell.appendChild(btn);
    document.body.appendChild(cell);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'hex-a-gone-bank',
      shape: 'triangle',
    });
    expect(inspectDropSpeech(btn)).toMatch(/Pattern-block bank: triangle/i);
  });
});
