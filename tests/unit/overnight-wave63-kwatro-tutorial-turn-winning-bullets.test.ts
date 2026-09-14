/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro turn/winning bullets exact.
 * Wave57 matches Select Chip needle; deepen exact ol/ul leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 63 kwatro — tutorial turn/winning bullets', () => {
  it('turn-sequence + winning titles/bullets exact', () => {
    const turn = kwatroSinkoTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.title).toBe('Turn Sequence');
    expect(turn?.position).toBe('bottom');
    expect(turn?.message).toContain(
      '<li><strong>Select Chip:</strong> Click one of your chips on the board</li>'
    );
    expect(turn?.message).toContain(
      '<li><strong>Move:</strong> Click a connected green space to move there</li>'
    );

    const winning = kwatroSinkoTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toContain(
      '<li>Form 3 chips in a line (any direction)</li>'
    );
    expect(winning?.message).toContain(
      '<li>Example: 6 + 3 - 5 = 4 ✓</li>'
    );
    expect(winning?.message).toContain(
      '<li>Example: 8 + 1 - 4 = 5 ✓</li>'
    );
  });
});
