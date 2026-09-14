/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro movement-rules highlight + bullets.
 * Wave55 matches Diagonal needle; deepen highlight + empty-adjacent exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 60 kwatro — tutorial movement highlight bullets', () => {
  it('movement-rules highlights board and lists pathway constraints', () => {
    const move = kwatroSinkoTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(move?.highlightSelector).toBe('.kwa-board');
    expect(move?.position).toBe('top');
    expect(move?.message).toContain(
      '<li>Chips move along the pathway connections</li>'
    );
    expect(move?.message).toContain(
      '<li>You can only move to empty adjacent spaces</li>'
    );
  });
});
