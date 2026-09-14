/**
 * Wave 56 leftover after #256 — Kwatro tutorial setup + turn-sequence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 56 kwatro — tutorial setup/turn', () => {
  it('Even/Odd setup highlight and turn-sequence steps', () => {
    const setup = kwatroSinkoTutorial.steps.find((s) => s.id === 'setup');
    expect(setup?.title).toBe('Setup');
    expect(setup?.highlightSelector).toBe('.kwa-chip-info');
    expect(setup?.message).toMatch(/Even chips \(0, 2, 4, 6, 8\)/);
    expect(setup?.message).toMatch(/Odd chips \(1, 3, 5, 7, 9\)/);
    const turn = kwatroSinkoTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.title).toBe('Turn Sequence');
    expect(turn?.message).toMatch(/Select Chip/);
    expect(turn?.message).toMatch(/connected green space/);
    expect(turn?.highlightSelector).toBe('.kwa-board');
  });
});
