/**
 * Overnight HEAVY leftover after #234 — clearHighlights removes .alignment-highlight SVG groups.
 * Distinct from burn-wave39-align-highlight-empty-path (class-only). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { clearHighlights } from '../../src/core/alignment';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 52 core align — clear svg groups', () => {
  it('appended highlight group is removed by clearHighlights', () => {
    const container = document.createElement('div');
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'alignment-highlight highlight-winning');
    container.appendChild(group);
    expect(container.querySelectorAll('.alignment-highlight')).toHaveLength(1);
    clearHighlights(container);
    expect(container.querySelectorAll('.alignment-highlight')).toHaveLength(0);
  });
});
