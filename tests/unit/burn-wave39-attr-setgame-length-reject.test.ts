/**
 * Wave 39 — isValidSetGameSet length ≠ 3 leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { isValidSetGameSet } from '../../src/core/attributes';
import type { AttributeDefinition, AttributePiece } from '../../src/core/attributes';

describe('Wave 39 attr — setgame length reject', () => {
  const attrs: AttributeDefinition[] = [
    { name: 'color', possibleValues: ['r', 'g', 'b'] },
    { name: 'shape', possibleValues: ['c', 's', 't'] },
  ];

  const trio: AttributePiece[] = [
    { id: '1', attributes: { color: 'r', shape: 'c' } },
    { id: '2', attributes: { color: 'g', shape: 's' } },
    { id: '3', attributes: { color: 'b', shape: 't' } },
  ];

  it('rejects length 2', () => {
    expect(isValidSetGameSet(trio.slice(0, 2), attrs)).toBe(false);
  });

  it('rejects length 4', () => {
    const four = [
      ...trio,
      { id: '4', attributes: { color: 'r', shape: 's' } },
    ];
    expect(isValidSetGameSet(four, attrs)).toBe(false);
  });

  it('accepts valid all-different trio', () => {
    expect(isValidSetGameSet(trio, attrs)).toBe(true);
  });

  it('rejects when one attribute is neither same nor all-different', () => {
    const bad: AttributePiece[] = [
      { id: '1', attributes: { color: 'r', shape: 'c' } },
      { id: '2', attributes: { color: 'r', shape: 's' } },
      { id: '3', attributes: { color: 'g', shape: 't' } },
    ];
    expect(isValidSetGameSet(bad, attrs)).toBe(false);
  });
});
