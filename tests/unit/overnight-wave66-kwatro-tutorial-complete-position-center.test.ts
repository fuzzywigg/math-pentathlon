/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro complete position center.
 * Wave60 locks Ready to Play! title + Finish CTA; deepen position. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 66 kwatro — tutorial complete position', () => {
  it('complete step is center positioned', () => {
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'complete')?.position
    ).toBe('center');
  });
});
