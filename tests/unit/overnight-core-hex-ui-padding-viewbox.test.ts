/**
 * Overnight TOKENMAXX — renderHexGrid padding expands viewBox.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderHexGrid } from '../../src/core/hex/hex-ui';
import { createLayout } from '../../src/core/hex/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core hex-ui — padding viewBox', () => {
  it('larger padding yields larger width/height attributes', () => {
    const layout = createLayout('pointy', 24, 0, 0);
    const tight = renderHexGrid(1, layout, { padding: 4 });
    const loose = renderHexGrid(1, layout, { padding: 40 });
    expect(Number(loose.getAttribute('width'))).toBeGreaterThan(
      Number(tight.getAttribute('width'))
    );
    expect(Number(loose.getAttribute('height'))).toBeGreaterThan(
      Number(tight.getAttribute('height'))
    );
  });

  it('background rect matches viewBox origin when set', () => {
    const layout = createLayout('flat', 20, 0, 0);
    const svg = renderHexGrid(0, layout, {
      padding: 10,
      background: '#ccddee',
    });
    const bg = svg.querySelector('rect');
    expect(bg?.getAttribute('fill')).toBe('#ccddee');
    const vb = svg.getAttribute('viewBox')!.split(' ').map(Number);
    expect(Number(bg?.getAttribute('x'))).toBe(vb[0]);
    expect(Number(bg?.getAttribute('y'))).toBe(vb[1]);
  });
});
