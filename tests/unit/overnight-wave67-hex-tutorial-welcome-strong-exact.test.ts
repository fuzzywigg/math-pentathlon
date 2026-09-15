/**
 * Wave 67 leftover after tip/#324 — Hex welcome strong name exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 67 hex — tutorial welcome strong', () => {
  it('welcome locks <strong>Hex</strong> markup', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain('<strong>Hex</strong>');
    expect(step?.title).toBe('Welcome to Hex!');
    expect(step?.position).toBe('center');
  });
});
