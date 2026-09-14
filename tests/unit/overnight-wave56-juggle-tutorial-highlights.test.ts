/**
 * Wave 56 leftover after #256 — Juggle tutorial highlights + positions.
 * Distinct from burn-wave wiring smoke. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 56 juggle — tutorial highlights', () => {
  it('anchors turn-sequence and placement-rules selectors', () => {
    const byId = Object.fromEntries(
      juggleTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['turn-sequence']?.highlightSelector).toBe('.juggle-dice-area');
    expect(byId['turn-sequence']?.position).toBe('bottom');
    expect(byId['placement-rules']?.highlightSelector).toBe('.juggle-boards');
    expect(byId['placement-rules']?.position).toBe('top');
    expect(byId['welcome']?.position).toBe('center');
    expect(byId['complete']?.position).toBe('center');
  });
});
