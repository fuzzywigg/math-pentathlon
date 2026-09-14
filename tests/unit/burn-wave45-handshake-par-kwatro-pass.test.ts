/**
 * Wave 45 — Handshake Par/Kwatro pass seat contrast leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as parInit, passTurn as parPass } from '../../src/games/par-55/rules';
import { createInitialState as kwaInit, passTurn as kwaPass } from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 handshake — pass contrast', () => {
  it('both pass flip p1→p2 and clear selection', () => {
    const p = parPass(parInit());
    const k = kwaPass(kwaInit());
    expect(p.currentPlayer).toBe('player2');
    expect(k.currentPlayer).toBe('player2');
    expect(p.selectedBlock).toBeNull();
    expect(k.selectedChip).toBeNull();
  });
});
