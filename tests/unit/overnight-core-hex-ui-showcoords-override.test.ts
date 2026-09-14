/**
 * Overnight TOKENMAXX — showCoords fills label only when label absent.
 * Tests-only. After #214/#215.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { renderHexGrid } from '../../src/core/hex/hex-ui';
import { createLayout, createAxial, coordKey } from '../../src/core/hex/types';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight core hex-ui — showCoords override', () => {
  it('explicit label wins over showCoords', () => {
    const layout = createLayout('pointy', 20);
    const svg = renderHexGrid(0, layout, {
      showCoords: true,
      getCellOptions: () => ({ label: 'CENTER' }),
    });
    expect(svg.querySelector('.hex-label')?.textContent).toBe('CENTER');
  });

  it('showCoords labels match coordKey for radius 1', () => {
    const layout = createLayout('flat', 18);
    const svg = renderHexGrid(1, layout, { showCoords: true });
    const labels = [...svg.querySelectorAll('.hex-label')].map(
      (t) => t.textContent
    );
    expect(labels).toContain(coordKey(createAxial(0, 0)));
    expect(labels).toContain(coordKey(createAxial(1, 0)));
    expect(labels).toHaveLength(7);
  });
});
