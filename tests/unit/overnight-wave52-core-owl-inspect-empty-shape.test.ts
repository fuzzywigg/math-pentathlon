/**
 * Overnight HEAVY leftover after #234 — data-shape="" fails truthy gate → not hex-a-gone-bank.
 * Distinct from owl-drop-inspect nonempty shape coverage. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 core owl — inspect empty shape', () => {
  it('empty data-shape attribute falls through to unknown', () => {
    const btn = document.createElement('button');
    btn.setAttribute('data-shape', '');
    document.body.appendChild(btn);
    expect(resolveInspectTarget(btn)).toEqual({ kind: 'unknown' });
  });

  it('nonempty data-shape resolves hex-a-gone-bank', () => {
    const btn = document.createElement('button');
    btn.setAttribute('data-shape', 'triangle');
    document.body.appendChild(btn);
    expect(resolveInspectTarget(btn)).toEqual({
      kind: 'hex-a-gone-bank',
      shape: 'triangle',
    });
  });
});
