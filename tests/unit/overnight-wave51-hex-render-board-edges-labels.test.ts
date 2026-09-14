/**
 * Overnight HEAVY leftovers after #234/#235 — Hex coordinate labels.
 * Distinct from #235 edge p1/p2 stroke leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — coordinate labels', () => {
  it('renders A.. and 1.. labels for size 5', () => {
    const size = 5;
    const box = document.createElement('div');
    document.body.appendChild(box);
    renderBoard(createInitialState(size), box, () => undefined);
    const labels = [...box.querySelectorAll('.hex-label')].map((n) => n.textContent);
    expect(labels).toContain('A');
    expect(labels).toContain(String.fromCharCode(65 + size - 1));
    expect(labels).toContain('1');
    expect(labels).toContain(String(size));
    expect(box.querySelectorAll('.hex-label').length).toBe(size * 2);
  });
});
