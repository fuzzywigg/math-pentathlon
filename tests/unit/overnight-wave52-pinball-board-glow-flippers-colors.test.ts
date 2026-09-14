/**
 * Overnight HEAVY leftover after #234 — Pinball board glow/flippers/target colors.
 * Wave48 only asserted class + value texts. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 52 pinball — board SVG chrome', () => {
  it('renders target-glow, high/low fills, and angled flippers', () => {
    const svg = renderPinballBoard(createInitialState());
    expect(svg.querySelector('#target-glow')).toBeTruthy();
    const circles = [...svg.querySelectorAll('circle')].filter(
      (c) => c.getAttribute('r') === '18'
    );
    const fills = circles.map((c) => c.getAttribute('fill'));
    expect(fills.filter((f) => f === '#f44336').length).toBe(3); // 100 + 2×50
    expect(fills.filter((f) => f === '#4caf50').length).toBe(7);
    const flippers = [...svg.querySelectorAll('rect')].filter(
      (r) => r.getAttribute('fill') === '#ff9800'
    );
    expect(flippers).toHaveLength(2);
    expect(flippers[0].getAttribute('transform')).toContain('rotate(-20');
    expect(flippers[1].getAttribute('transform')).toContain('rotate(20');
  });
});
