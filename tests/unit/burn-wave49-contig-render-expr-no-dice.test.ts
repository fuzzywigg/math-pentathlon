/**
 * Wave 49 leftover after #221/#226/#227 — Contig expression selector empty without dice. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 49 contig — expr no dice', () => {
  it('returns empty contig-expressions when currentDice null', () => {
    const el = renderExpressionSelector(createInitialState(), () => undefined, () => undefined);
    expect(el.classList.contains('contig-expressions')).toBe(true);
    expect(el.children.length).toBe(0);
  });
});
