/**
 * Wave 40 — getGamesPlayedByDivision + importData fail leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
});
afterEach(() => {
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 40 storage — division / import fail', () => {
  it('getGamesPlayedByDivision always empty object', () => {
    expect(storage.getGamesPlayedByDivision()).toEqual({});
  });

  it('importData bad JSON returns false and keeps data', () => {
    storage.createProfile('wave40', 'owl');
    expect(storage.importData('{')).toBe(false);
    expect(storage.getProfile()?.name).toBe('wave40');
  });
});
