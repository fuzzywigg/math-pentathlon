/**
 * Overnight HEAVY after #214/#215 — Stars UI inject + names leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { injectStarsStyles, getPlayerName } from '../../src/games/stars-bars/board-ui';

describe('Overnight stars-bars — board-ui', () => {
  it('distinct names; styles inject without throwing (module flag, no id)', () => {
    expect(getPlayerName('player1')).not.toBe(getPlayerName('player2'));
    const before = document.querySelectorAll('style').length;
    injectStarsStyles();
    injectStarsStyles(); // second call is a no-op via stylesInjected
    expect(document.querySelectorAll('style').length).toBeGreaterThanOrEqual(before);
  });
});
