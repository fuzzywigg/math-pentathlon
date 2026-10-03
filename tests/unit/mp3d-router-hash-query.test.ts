import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getCurrentPath } from '../../src/core/router';

describe('mp3d router hash query strip', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => {
    window.location.hash = '';
  });

  it('strips feature-flag query from hash path', () => {
    window.location.hash = '#/game/kings-quadraphages?board3d=1';
    expect(getCurrentPath()).toBe('/game/kings-quadraphages');
  });

  it('keeps plain hash paths unchanged', () => {
    window.location.hash = '#/game/kings-quadraphages';
    expect(getCurrentPath()).toBe('/game/kings-quadraphages');
  });
});
