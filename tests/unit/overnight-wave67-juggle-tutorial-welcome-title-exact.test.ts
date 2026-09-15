/**
 * Wave 67 leftover after tip/#323/#324 — welcome title exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 juggle — tutorial welcome title exact', () => {
  it('welcome title is Welcome to Juggle!', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.title).toBe('Welcome to Juggle!');
    expect(step?.position).toBe('center');
  });
});
