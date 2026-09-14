/**
 * Overnight HEAVY leftovers after #234 — Hex edge chrome + coordinate labels. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 51 hex — edges + labels', () => {
  it('draws p1/p2 edges and A1.. labels for size 5', () => {
    const size = 5;
    const box = document.createElement('div');
    document.body.appendChild(box);
    renderBoard(createInitialState(size), box, () => undefined);
    expect(box.querySelectorAll('.hex-edge-p1').length).toBe(2);
    expect(box.querySelectorAll('.hex-edge-p2').length).toBe(2);
    const labels = [...box.querySelectorAll('.hex-label')].map((n) => n.textContent);
    expect(labels).toContain('A');
    expect(labels).toContain(String.fromCharCode(65 + size - 1));
    expect(labels).toContain('1');
    expect(labels).toContain(String(size));
  });
});
