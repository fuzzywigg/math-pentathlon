/**
 * Overnight TOKENMAXX — renderHex wires onClick / onHover entering flag.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { renderHex } from '../../src/core/hex/hex-ui';
import { createLayout, createAxial } from '../../src/core/hex/types';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Overnight core hex-ui — render click/hover', () => {
  it('click fires coord; hover passes entering true/false', () => {
    const layout = createLayout('pointy', 25, 0, 0);
    const clicks: string[] = [];
    const hovers: Array<{ q: number; r: number; entering: boolean }> = [];
    const g = renderHex(createAxial(-1, 2), layout, {
      label: 'x',
      className: 'special',
      onClick: (c) => clicks.push(`${c.q},${c.r}`),
      onHover: (c, entering) => hovers.push({ q: c.q, r: c.r, entering }),
    });
    expect(g.classList.contains('special')).toBe(true);
    expect(g.classList.contains('hex-cell')).toBe(true);
    expect(g.querySelector('.hex-label')?.textContent).toBe('x');
    g.dispatchEvent(new Event('click'));
    g.dispatchEvent(new Event('mouseenter'));
    g.dispatchEvent(new Event('mouseleave'));
    expect(clicks).toEqual(['-1,2']);
    expect(hovers).toEqual([
      { q: -1, r: 2, entering: true },
      { q: -1, r: 2, entering: false },
    ]);
  });
});
