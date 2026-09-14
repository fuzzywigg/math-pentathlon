/**
 * Overnight HEAVY leftover after #256 — Kings .cell[data-row][data-col] inspect.
 * Distinct from wave52 empty data-shape / wave55 new-game. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { inspectDropSpeech, resolveInspectTarget } from '../../src/core/owl';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 core owl — inspect kings-cell', () => {
  it('kings cell attrs resolve row/col speech', () => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('data-row', '2');
    cell.setAttribute('data-col', '3');
    document.body.appendChild(cell);
    expect(resolveInspectTarget(cell)).toEqual({
      kind: 'kings-cell',
      row: 2,
      col: 3,
    });
    expect(inspectDropSpeech(cell)).toMatch(/Kings cell row 2, column 3/i);
  });
});
