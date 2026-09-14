/**
 * Overnight HEAVY leftover after #264 — hex-cell-group inspect speech.
 * Distinct from wave56 kings/FIAR/star; wave40 priority only. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 core owl — inspect hex-cell', () => {
  it('hex-cell-group resolves hex-cell speech', () => {
    const g = document.createElement('div');
    g.className = 'hex-cell-group';
    g.setAttribute('data-row', '1');
    g.setAttribute('data-col', '4');
    document.body.appendChild(g);
    expect(resolveInspectTarget(g)).toEqual({
      kind: 'hex-cell',
      row: 1,
      col: 4,
    });
    expect(inspectDropSpeech(g)).toMatch(/Hex cell at row 1, column 4/i);
  });
});
