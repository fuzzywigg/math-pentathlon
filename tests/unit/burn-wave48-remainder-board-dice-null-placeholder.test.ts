/**
 * Wave 48 — Remainder renderDice null placeholders. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderDice } from '../../src/games/remainder-islands/board-ui';

describe('Wave 48 remainder — dice null', () => {
  it('shows placeholder icons when roll null', () => {
    const el = renderDice(null);
    expect(el.querySelector('.dice-placeholder')).toBeTruthy();
    expect(el.querySelectorAll('.dice-icon').length).toBe(2);
  });
});
